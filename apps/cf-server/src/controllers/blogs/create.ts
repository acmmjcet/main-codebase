import { customAlphabet } from 'nanoid';
import { eq } from 'drizzle-orm';
import { blogs } from '../../db/schema';
import { drizzle } from 'drizzle-orm/d1';
import type { Context } from 'hono';
import { BlogData } from '../../types/blog';
import { validateEmail } from '../../helpers/validate-email';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

const VALID_STATUSES = ['draft', 'published', 'archived', 'scheduled'] as const;
const VALID_POST_TYPES = ['regular', 'video', 'gallery', 'quote', 'link'] as const;

// Validation utilities
const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateSlug = (slug: string): boolean => 
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 200;

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);

const normalizeCategorySlug = (category: string): string =>
  category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseToJson = (data: unknown, fieldName: string): string | null => {
  if (!data) return null;

  try {
    if (typeof data === 'string') {
      const trimmed = data.trim();
      if (trimmed.startsWith('[')) {
        JSON.parse(trimmed);
        return trimmed;
      }
      const items = data.split(',').map(s => s.trim()).filter(Boolean);
      return items.length ? JSON.stringify(items) : null;
    }
    
    if (Array.isArray(data)) {
      const items = data.filter(item => typeof item === 'string' && item.trim());
      return items.length ? JSON.stringify(items) : null;
    }
    
    if (typeof data === 'object') {
      return JSON.stringify(data);
    }
    
    throw new Error(`Invalid ${fieldName} format`);
  } catch (error) {
    throw new Error(`Failed to parse ${fieldName}: ${error instanceof Error ? error.message : 'Invalid format'}`);
  }
};

const ensureUniqueSlug = async (db: any, baseSlug: string): Promise<string> => {
  let slug = baseSlug;
  let attempts = 0;

  while (attempts <= 10) {
    const existing = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1)
      .then((res: any[]) => res[0]);

    if (!existing) return slug;
    
    attempts++;
    slug = `${baseSlug}-${nanoid(4).toLowerCase()}`;
  }

  throw new Error('Unable to generate unique slug');
};

const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const createBlogPost = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    
    let body: BlogData;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, message: 'Invalid JSON', error: 'INVALID_JSON' }, 400);
    }

    // Required field validation
    const requiredFields = [
      { field: body.title, name: 'title', error: 'MISSING_TITLE' },
      { field: body.content, name: 'content', error: 'MISSING_CONTENT' },
      { field: body.category, name: 'category', error: 'MISSING_CATEGORY' },
      { field: body.authorName, name: 'authorName', error: 'MISSING_AUTHOR_NAME' }
    ];

    for (const { field, name, error } of requiredFields) {
      if (!field?.trim()) {
        return c.json({ success: false, message: `${name} is required`, error }, 400);
      }
    }

    // Length validations
    if (body.title.trim().length > 500) {
      return c.json({ success: false, message: 'Title max 500 characters', error: 'TITLE_TOO_LONG' }, 400);
    }

    if (body.excerpt && body.excerpt.trim().length > 1000) {
      return c.json({ success: false, message: 'Excerpt max 1000 characters', error: 'EXCERPT_TOO_LONG' }, 400);
    }

    // Normalize category to slug format
    const normalizedCategory = normalizeCategorySlug(body.category);
    if (!normalizedCategory) {
      return c.json({ 
        success: false, 
        message: 'Invalid category format', 
        error: 'INVALID_CATEGORY' 
      }, 400);
    }

    // Slug generation/validation
    let finalSlug = body.slug || generateSlug(body.title);
    
    if (body.slug && !validateSlug(body.slug)) {
      return c.json({ 
        success: false, 
        message: 'Invalid slug format (lowercase, numbers, hyphens only)', 
        error: 'INVALID_SLUG_FORMAT' 
      }, 400);
    }

    if (!finalSlug) {
      return c.json({ success: false, message: 'Unable to generate slug', error: 'SLUG_GENERATION_FAILED' }, 400);
    }

    try {
      finalSlug = await ensureUniqueSlug(db, finalSlug);
    } catch (error) {
      return c.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Slug generation failed', 
        error: 'SLUG_GENERATION_EXHAUSTED' 
      }, 500);
    }

    // Parse array fields
    let parsedTags: string | null = null;
    let parsedRelatedBlogs: string | null = null;

    try {
      if (body.tags) parsedTags = parseToJson(body.tags, 'tags');
      if (body.relatedBlogs) parsedRelatedBlogs = parseToJson(body.relatedBlogs, 'relatedBlogs');
    } catch (error) {
      return c.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Invalid array format', 
        error: 'INVALID_ARRAY_FORMAT' 
      }, 400);
    }

    // Email validation
    if (body.authorId?.includes('@') && !validateEmail(body.authorId)) {
      return c.json({ success: false, message: 'Invalid author email', error: 'INVALID_AUTHOR_EMAIL' }, 400);
    }

    // URL validations
    const urlFields = [
      { url: body.featuredImage, error: 'INVALID_FEATURED_IMAGE_URL' },
      { url: body.authorProfileImage, error: 'INVALID_AUTHOR_PROFILE_IMAGE_URL' },
      { url: body.externalUrl, error: 'INVALID_EXTERNAL_URL' }
    ];

    for (const { url, error } of urlFields) {
      if (url && !validateUrl(url)) {
        return c.json({ success: false, message: 'Invalid URL', error }, 400);
      }
    }

    // Image dimension validations
    if (body.featuredImageWidth && (body.featuredImageWidth < 1 || body.featuredImageWidth > 10000)) {
      return c.json({ success: false, message: 'Image width: 1-10000px', error: 'INVALID_IMAGE_WIDTH' }, 400);
    }

    if (body.featuredImageHeight && (body.featuredImageHeight < 1 || body.featuredImageHeight > 10000)) {
      return c.json({ success: false, message: 'Image height: 1-10000px', error: 'INVALID_IMAGE_HEIGHT' }, 400);
    }

    // Status validation
    const status = (body.status?.toLowerCase() || 'draft') as typeof VALID_STATUSES[number];
    if (!VALID_STATUSES.includes(status)) {
      return c.json({ 
        success: false, 
        message: `Invalid status: ${VALID_STATUSES.join(', ')}`, 
        error: 'INVALID_STATUS' 
      }, 400);
    }

    // Post type validation
    const postType = (body.postType?.toLowerCase() || 'regular') as typeof VALID_POST_TYPES[number];
    if (!VALID_POST_TYPES.includes(postType)) {
      return c.json({ 
        success: false, 
        message: `Invalid post type: ${VALID_POST_TYPES.join(', ')}`, 
        error: 'INVALID_POST_TYPE' 
      }, 400);
    }

    // Date handling
    let publishedAt: string;
    if (body.publishedAt) {
      const date = new Date(body.publishedAt);
      if (isNaN(date.getTime())) {
        return c.json({ success: false, message: 'Invalid date format', error: 'INVALID_PUBLISHED_DATE' }, 400);
      }
      publishedAt = date.toISOString();
    } else {
      publishedAt = new Date().toISOString();
    }

    const blogId = `BLOG-${nanoid()}`;
    const now = new Date().toISOString();

    // Prepare blog data with normalized category
    const blogData = {
      blogId,
      title: body.title.trim(),
      slug: finalSlug,
      content: body.content.trim(),
      excerpt: body.excerpt?.trim() || null,
      category: normalizedCategory, // Store as slug-friendly format
      tags: parsedTags,
      authorName: body.authorName.trim(),
      authorId: body.authorId?.trim() || null,
      authorBio: body.authorBio?.trim() || null,
      authorProfileImage: body.authorProfileImage?.trim() || null,
      featuredImage: body.featuredImage?.trim() || null,
      featuredImageAltText: body.featuredImageAltText?.trim() || null,
      featuredImageWidth: body.featuredImageWidth || null,
      featuredImageHeight: body.featuredImageHeight || null,
      isFeatured: body.isFeatured ?? false,
      isPublished: body.isPublished ?? false,
      isApproved: body.isApproved ?? false,
      views: 0,
      comments: 0,
      upvotes: 0,
      downvotes: 0,
      shares: 0,
      seoTitle: body.seoTitle?.trim() || null,
      seoDescription: body.seoDescription?.trim() || null,
      postType,
      relatedBlogs: parsedRelatedBlogs,
      status,
      externalUrl: body.externalUrl?.trim() || null,
      estimatedReadTime: estimateReadTime(body.content),
      scheduledAt: body.scheduledAt || null,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    };

    // Insert blog post
    const result = await db.insert(blogs).values(blogData).returning().catch((err: any) => {
      if (err?.message?.includes('UNIQUE constraint failed')) {
        throw new Error('DUPLICATE_ENTRY');
      }
      throw err;
    });

    if (!result?.length) {
      return c.json({ success: false, message: 'Failed to create blog', error: 'INSERT_FAILED' }, 500);
    }

    return c.json({
      success: true,
      message: 'Blog post created successfully',
      data: {
        id: result[0].id,
        blogId,
        slug: finalSlug,
        title: body.title.trim(),
        category: normalizedCategory,
        status,
        isPublished: body.isPublished ?? false,
        estimatedReadTime: blogData.estimatedReadTime,
        createdAt: now,
      },
    }, 201);

  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
    if (error.message === 'DUPLICATE_ENTRY') {
      return c.json({ success: false, message: 'Duplicate slug or ID', error: 'DUPLICATE_ENTRY' }, 409);
    }
    
    return c.json({ success: false, message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR' }, 500);
  }
};