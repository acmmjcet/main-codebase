import { drizzle } from 'drizzle-orm/d1';
import { eq, and, ne } from 'drizzle-orm';
import { blogs } from '../../db/schema';
import type { Context } from 'hono';
import { validateEmail } from '../../helpers/validate-email';

const VALID_STATUSES = ['draft', 'published', 'archived', 'scheduled'] as const;
const VALID_POST_TYPES = ['regular', 'video', 'gallery', 'quote', 'link'] as const;

// Shared utilities
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

const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const ensureUniqueSlug = async (db: any, slug: string, currentBlogId: number): Promise<boolean> => {
  const existing = await db
    .select({ id: blogs.id })
    .from(blogs)
    .where(and(eq(blogs.slug, slug), ne(blogs.id, currentBlogId)))
    .limit(1)
    .then((res: any[]) => res[0]);

  return !existing;
};

// Update blog post by ID
export const updateBlogById = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const blogId = c.req.param('blogId')?.trim();

    if (!blogId) {
      return c.json({
        success: false,
        message: 'Blog ID parameter is required',
        error: 'MISSING_BLOG_ID'
      }, 400);
    }

    // Fetch existing blog
    const existingBlog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.blogId, blogId))
      .limit(1)
      .then(res => res[0]);

    if (!existingBlog) {
      return c.json({
        success: false,
        message: `Blog post with ID '${blogId}' not found`,
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, message: 'Invalid JSON', error: 'INVALID_JSON' }, 400);
    }

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Title validation
    if (body.title !== undefined) {
      if (!body.title?.trim()) {
        return c.json({ success: false, message: 'Title cannot be empty', error: 'INVALID_TITLE' }, 400);
      }
      if (body.title.trim().length > 500) {
        return c.json({ success: false, message: 'Title max 500 characters', error: 'TITLE_TOO_LONG' }, 400);
      }
      updates.title = body.title.trim();
      
      // Recalculate read time if content is being updated
      if (body.content !== undefined) {
        updates.estimatedReadTime = estimateReadTime(body.content);
      }
    }

    // Content validation
    if (body.content !== undefined) {
      if (!body.content?.trim()) {
        return c.json({ success: false, message: 'Content cannot be empty', error: 'INVALID_CONTENT' }, 400);
      }
      updates.content = body.content.trim();
      updates.estimatedReadTime = estimateReadTime(body.content);
    }

    // Excerpt validation
    if (body.excerpt !== undefined) {
      if (body.excerpt && body.excerpt.trim().length > 1000) {
        return c.json({ success: false, message: 'Excerpt max 1000 characters', error: 'EXCERPT_TOO_LONG' }, 400);
      }
      updates.excerpt = body.excerpt?.trim() || null;
    }

    // Category validation and normalization
    if (body.category !== undefined) {
      if (!body.category?.trim()) {
        return c.json({ success: false, message: 'Category cannot be empty', error: 'INVALID_CATEGORY' }, 400);
      }
      const normalizedCategory = normalizeCategorySlug(body.category);
      if (!normalizedCategory) {
        return c.json({ success: false, message: 'Invalid category format', error: 'INVALID_CATEGORY' }, 400);
      }
      updates.category = normalizedCategory;
    }

    // Slug validation and uniqueness check
    if (body.slug !== undefined) {
      if (!validateSlug(body.slug)) {
        return c.json({
          success: false,
          message: 'Invalid slug format (lowercase, numbers, hyphens only)',
          error: 'INVALID_SLUG_FORMAT'
        }, 400);
      }
      
      const isUnique = await ensureUniqueSlug(db, body.slug, existingBlog.id);
      if (!isUnique) {
        return c.json({
          success: false,
          message: 'Slug already exists',
          error: 'DUPLICATE_SLUG'
        }, 409);
      }
      
      updates.slug = body.slug;
    }

    // Tags validation
    if (body.tags !== undefined) {
      try {
        updates.tags = parseToJson(body.tags, 'tags');
      } catch (error) {
        return c.json({
          success: false,
          message: error instanceof Error ? error.message : 'Invalid tags format',
          error: 'INVALID_TAGS'
        }, 400);
      }
    }

    // Related blogs validation
    if (body.relatedBlogs !== undefined) {
      try {
        updates.relatedBlogs = parseToJson(body.relatedBlogs, 'relatedBlogs');
      } catch (error) {
        return c.json({
          success: false,
          message: error instanceof Error ? error.message : 'Invalid relatedBlogs format',
          error: 'INVALID_RELATED_BLOGS'
        }, 400);
      }
    }

    // Author fields
    if (body.authorName !== undefined) {
      if (!body.authorName?.trim()) {
        return c.json({ success: false, message: 'Author name cannot be empty', error: 'INVALID_AUTHOR_NAME' }, 400);
      }
      updates.authorName = body.authorName.trim();
    }

    if (body.authorId !== undefined) {
      if (body.authorId?.includes('@') && !validateEmail(body.authorId)) {
        return c.json({ success: false, message: 'Invalid author email', error: 'INVALID_AUTHOR_EMAIL' }, 400);
      }
      updates.authorId = body.authorId?.trim() || null;
    }

    if (body.authorBio !== undefined) {
      updates.authorBio = body.authorBio?.trim() || null;
    }

    if (body.authorProfileImage !== undefined) {
      if (body.authorProfileImage && !validateUrl(body.authorProfileImage)) {
        return c.json({ success: false, message: 'Invalid author profile image URL', error: 'INVALID_URL' }, 400);
      }
      updates.authorProfileImage = body.authorProfileImage?.trim() || null;
    }

    // Featured image fields
    if (body.featuredImage !== undefined) {
      if (body.featuredImage && !validateUrl(body.featuredImage)) {
        return c.json({ success: false, message: 'Invalid featured image URL', error: 'INVALID_URL' }, 400);
      }
      updates.featuredImage = body.featuredImage?.trim() || null;
    }

    if (body.featuredImageAltText !== undefined) {
      updates.featuredImageAltText = body.featuredImageAltText?.trim() || null;
    }

    // Boolean fields
    if (body.isFeatured !== undefined) {
      updates.isFeatured = Boolean(body.isFeatured);
    }

    if (body.isPublished !== undefined) {
      updates.isPublished = Boolean(body.isPublished);
    }

    if (body.isApproved !== undefined) {
      updates.isApproved = Boolean(body.isApproved);
    }

    // SEO fields
    if (body.seoTitle !== undefined) {
      updates.seoTitle = body.seoTitle?.trim() || null;
    }

    if (body.seoDescription !== undefined) {
      updates.seoDescription = body.seoDescription?.trim() || null;
    }

    // Status validation
    if (body.status !== undefined) {
      const status = body.status.toLowerCase();
      if (!VALID_STATUSES.includes(status as any)) {
        return c.json({
          success: false,
          message: `Invalid status: ${VALID_STATUSES.join(', ')}`,
          error: 'INVALID_STATUS'
        }, 400);
      }
      updates.status = status;
    }

    // Post type validation
    if (body.postType !== undefined) {
      const postType = body.postType.toLowerCase();
      if (!VALID_POST_TYPES.includes(postType as any)) {
        return c.json({
          success: false,
          message: `Invalid post type: ${VALID_POST_TYPES.join(', ')}`,
          error: 'INVALID_POST_TYPE'
        }, 400);
      }
      updates.postType = postType;
    }

    // External URL
    if (body.externalUrl !== undefined) {
      if (body.externalUrl && !validateUrl(body.externalUrl)) {
        return c.json({ success: false, message: 'Invalid external URL', error: 'INVALID_URL' }, 400);
      }
      updates.externalUrl = body.externalUrl?.trim() || null;
    }

    // Scheduled date
    if (body.scheduledAt !== undefined) {
      if (body.scheduledAt) {
        const date = new Date(body.scheduledAt);
        if (isNaN(date.getTime())) {
          return c.json({ success: false, message: 'Invalid scheduledAt date', error: 'INVALID_DATE' }, 400);
        }
        updates.scheduledAt = date.toISOString();
      } else {
        updates.scheduledAt = null;
      }
    }

    // Published date
    if (body.publishedAt !== undefined) {
      const date = new Date(body.publishedAt);
      if (isNaN(date.getTime())) {
        return c.json({ success: false, message: 'Invalid publishedAt date', error: 'INVALID_DATE' }, 400);
      }
      updates.publishedAt = date.toISOString();
    }

    // Perform update
    const result = await db
      .update(blogs)
      .set(updates)
      .where(eq(blogs.blogId, blogId))
      .returning()
      .catch((err: any) => {
        if (err?.message?.includes('UNIQUE constraint failed')) {
          throw new Error('DUPLICATE_ENTRY');
        }
        throw err;
      });

    if (!result?.length) {
      return c.json({
        success: false,
        message: 'Failed to update blog post',
        error: 'UPDATE_FAILED'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Blog post updated successfully',
      data: {
        id: result[0].id,
        blogId: result[0].blogId,
        slug: result[0].slug,
        title: result[0].title,
        updatedAt: updates.updatedAt,
      },
    });

  } catch (error: any) {
    console.error('Error updating blog post:', error);
    
    if (error.message === 'DUPLICATE_ENTRY') {
      return c.json({ success: false, message: 'Duplicate slug', error: 'DUPLICATE_ENTRY' }, 409);
    }
    
    return c.json({ success: false, message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR' }, 500);
  }
};

// Increment blog views
export const incrementBlogViews = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const identifier = c.req.param('identifier')?.trim();
    const bySlug = c.req.query('bySlug') === 'true';

    if (!identifier) {
      return c.json({
        success: false,
        message: 'Blog identifier is required',
        error: 'MISSING_IDENTIFIER'
      }, 400);
    }

    const condition = bySlug ? eq(blogs.slug, identifier) : eq(blogs.blogId, identifier);

    const blog = await db
      .select()
      .from(blogs)
      .where(condition)
      .limit(1)
      .then(res => res[0]);

    if (!blog) {
      return c.json({
        success: false,
        message: 'Blog post not found',
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    const result = await db
      .update(blogs)
      .set({ views: blog.views + 1 })
      .where(eq(blogs.id, blog.id))
      .returning();

    return c.json({
      success: true,
      message: 'Views incremented successfully',
      data: { views: result[0].views },
    });

  } catch (error) {
    console.error('Error incrementing views:', error);
    return c.json({ success: false, message: 'Failed to increment views', error: 'UPDATE_FAILED' }, 500);
  }
};

// Update blog engagement (upvotes, downvotes, shares, comments)
export const updateBlogEngagement = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const blogId = c.req.param('blogId')?.trim();

    if (!blogId) {
      return c.json({
        success: false,
        message: 'Blog ID parameter is required',
        error: 'MISSING_BLOG_ID'
      }, 400);
    }

    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, message: 'Invalid JSON', error: 'INVALID_JSON' }, 400);
    }

    const blog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.blogId, blogId))
      .limit(1)
      .then(res => res[0]);

    if (!blog) {
      return c.json({
        success: false,
        message: 'Blog post not found',
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    const updates: any = { updatedAt: new Date().toISOString() };

    // Handle increment/decrement operations
    if (body.upvotes !== undefined) {
      const value = Number(body.upvotes);
      if (isNaN(value)) {
        return c.json({ success: false, message: 'Invalid upvotes value', error: 'INVALID_VALUE' }, 400);
      }
      updates.upvotes = Math.max(0, blog.upvotes + value);
    }

    if (body.downvotes !== undefined) {
      const value = Number(body.downvotes);
      if (isNaN(value)) {
        return c.json({ success: false, message: 'Invalid downvotes value', error: 'INVALID_VALUE' }, 400);
      }
      updates.downvotes = Math.max(0, blog.downvotes + value);
    }

    if (body.shares !== undefined) {
      const value = Number(body.shares);
      if (isNaN(value)) {
        return c.json({ success: false, message: 'Invalid shares value', error: 'INVALID_VALUE' }, 400);
      }
      updates.shares = Math.max(0, blog.shares + value);
    }

    if (body.comments !== undefined) {
      const value = Number(body.comments);
      if (isNaN(value)) {
        return c.json({ success: false, message: 'Invalid comments value', error: 'INVALID_VALUE' }, 400);
      }
      updates.comments = Math.max(0, blog.comments + value);
    }

    const result = await db
      .update(blogs)
      .set(updates)
      .where(eq(blogs.blogId, blogId))
      .returning();

    return c.json({
      success: true,
      message: 'Engagement updated successfully',
      data: {
        upvotes: result[0].upvotes,
        downvotes: result[0].downvotes,
        shares: result[0].shares,
        comments: result[0].comments,
      },
    });

  } catch (error) {
    console.error('Error updating engagement:', error);
    return c.json({ success: false, message: 'Failed to update engagement', error: 'UPDATE_FAILED' }, 500);
  }
};

// Publish/unpublish blog
export const toggleBlogPublish = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const blogId = c.req.param('blogId')?.trim();

    if (!blogId) {
      return c.json({
        success: false,
        message: 'Blog ID parameter is required',
        error: 'MISSING_BLOG_ID'
      }, 400);
    }

    const blog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.blogId, blogId))
      .limit(1)
      .then(res => res[0]);

    if (!blog) {
      return c.json({
        success: false,
        message: 'Blog post not found',
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    const newPublishState = !blog.isPublished;
    const updates: any = {
      isPublished: newPublishState,
      status: newPublishState ? 'published' : 'draft',
      updatedAt: new Date().toISOString(),
    };

    if (newPublishState && !blog.publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }

    const result = await db
      .update(blogs)
      .set(updates)
      .where(eq(blogs.blogId, blogId))
      .returning();

    return c.json({
      success: true,
      message: `Blog post ${newPublishState ? 'published' : 'unpublished'} successfully`,
      data: {
        blogId: result[0].blogId,
        isPublished: result[0].isPublished,
        status: result[0].status,
      },
    });

  } catch (error) {
    console.error('Error toggling publish state:', error);
    return c.json({ success: false, message: 'Failed to toggle publish state', error: 'UPDATE_FAILED' }, 500);
  }
};