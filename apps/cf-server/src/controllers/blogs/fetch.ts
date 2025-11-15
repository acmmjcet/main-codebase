import { drizzle } from 'drizzle-orm/d1';
import { eq, and, desc, like, or, sql } from 'drizzle-orm';
import { blogs } from '../../db/schema';
import type { Context } from 'hono';

// Shared utilities
const parseJsonField = (field: string | null): any => {
  if (!field) return null;
  try {
    return JSON.parse(field);
  } catch {
    return field;
  }
};

const parseBlogData = (blog: any) => ({
  ...blog,
  tags: parseJsonField(blog.tags),
  relatedBlogs: parseJsonField(blog.relatedBlogs),
});

const validateSlug = (slug: string): boolean => 
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 200;

const getPaginationParams = (c: Context) => {
  const page = Math.max(Number(c.req.query('page')) || 1, 1);
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 10, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
};

const buildPaginationResponse = (page: number, limit: number, totalCount: number) => {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

// Get count efficiently
const getCount = async (db: any, conditions: any[]) => {
  const baseQuery = db.select({ count: sql<number>`count(*)` }).from(blogs);
  const query = conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;
  const result = await query.then((res: any[]) => res[0]);
  return result?.count || 0;
};

export const getAllBlogs = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const { page, limit, offset } = getPaginationParams(c);

    // Parse query params
    const category = c.req.query('category')?.trim();
    const status = c.req.query('status')?.toLowerCase();
    const isPublished = c.req.query('published');
    const isFeatured = c.req.query('featured');
    const authorId = c.req.query('authorId')?.trim();
    const search = c.req.query('search')?.trim();
    const sortBy = c.req.query('sortBy') || 'createdAt';
    const sortOrder = c.req.query('sortOrder')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Build conditions
    const conditions = [];

    if (category) conditions.push(eq(blogs.category, category));
    if (status) conditions.push(eq(blogs.status, status));
    if (authorId) conditions.push(eq(blogs.authorId, authorId));
    if (isPublished !== undefined) conditions.push(eq(blogs.isPublished, isPublished === 'true'));
    if (isFeatured !== undefined) conditions.push(eq(blogs.isFeatured, isFeatured === 'true'));
    
    // Enhanced search across multiple fields
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          like(blogs.title, searchPattern),
          like(blogs.excerpt, searchPattern),
          like(blogs.content, searchPattern),
          like(blogs.authorName, searchPattern)
        )
      );
    }

    // Get total count efficiently
    const totalCount = await getCount(db, conditions);

    // Build query
    const baseQuery = db.select().from(blogs);
    const query = conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

    // Dynamic sorting
    const sortColumn = (blogs[sortBy as keyof typeof blogs] || blogs.createdAt) as any;
    const orderFn = sortOrder === 'asc' ? sortColumn : desc(sortColumn);

    // Fetch paginated data
    const results = await query
      .orderBy(orderFn)
      .limit(limit)
      .offset(offset)
      .all();

    const parsedResults = results.map(parseBlogData);

    return c.json({
      success: true,
      message: `Fetched ${parsedResults.length} blog post${parsedResults.length !== 1 ? 's' : ''}`,
      data: parsedResults,
      pagination: buildPaginationResponse(page, limit, totalCount),
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: 'FETCH_ERROR'
    }, 500);
  }
};

export const getBlogBySlug = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const slug = c.req.param('slug')?.trim();

    if (!slug) {
      return c.json({
        success: false,
        message: 'Slug parameter is required',
        error: 'MISSING_SLUG'
      }, 400);
    }

    if (!validateSlug(slug)) {
      return c.json({
        success: false,
        message: 'Invalid slug format (lowercase, numbers, hyphens only)',
        error: 'INVALID_SLUG_FORMAT'
      }, 400);
    }

    // Optional: increment views
    const incrementViews = c.req.query('incrementViews') === 'true';

    const blog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1)
      .then(res => res[0]);

    if (!blog) {
      return c.json({
        success: false,
        message: `Blog post with slug '${slug}' not found`,
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    // Increment views if requested
    if (incrementViews) {
      await db
        .update(blogs)
        .set({ views: blog.views + 1 })
        .where(eq(blogs.id, blog.id))
        .catch(err => console.error('Failed to increment views:', err));
    }

    return c.json({
      success: true,
      message: 'Blog post fetched successfully',
      data: parseBlogData(blog),
    });

  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch blog post',
      error: 'FETCH_ERROR'
    }, 500);
  }
};

export const getBlogById = async (c: Context) => {
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
        message: `Blog post with ID '${blogId}' not found`,
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    return c.json({
      success: true,
      message: 'Blog post fetched successfully',
      data: parseBlogData(blog),
    });

  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch blog post',
      error: 'FETCH_ERROR'
    }, 500);
  }
};

export const getBlogsByCategory = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const category = c.req.param('category')?.trim();

    if (!category) {
      return c.json({
        success: false,
        message: 'Category parameter is required',
        error: 'MISSING_CATEGORY'
      }, 400);
    }

    const { page, limit, offset } = getPaginationParams(c);

    // Additional filters
    const isPublished = c.req.query('published');
    const isFeatured = c.req.query('featured');
    const status = c.req.query('status')?.toLowerCase();
    const sortBy = c.req.query('sortBy') || 'createdAt';
    const sortOrder = c.req.query('sortOrder')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Build conditions
    const conditions = [eq(blogs.category, category)];

    if (isPublished !== undefined) conditions.push(eq(blogs.isPublished, isPublished === 'true'));
    if (isFeatured !== undefined) conditions.push(eq(blogs.isFeatured, isFeatured === 'true'));
    if (status) conditions.push(eq(blogs.status, status));

    // Get total count
    const totalCount = await getCount(db, conditions);

    // Dynamic sorting
    const sortColumn = (blogs[sortBy as keyof typeof blogs] || blogs.createdAt) as any;
    const orderFn = sortOrder === 'asc' ? sql`${sortColumn} ASC` : desc(sortColumn);

    // Fetch paginated data
    const results = await db
      .select()
      .from(blogs)
      .where(and(...conditions))
      .orderBy(orderFn)
      .limit(limit)
      .offset(offset)
      .all();

    const parsedResults = results.map(parseBlogData);

    return c.json({
      success: true,
      message: `Fetched ${parsedResults.length} blog post${parsedResults.length !== 1 ? 's' : ''} for category '${category}'`,
      data: parsedResults,
      pagination: buildPaginationResponse(page, limit, totalCount),
    });

  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch blog posts by category',
      error: 'FETCH_ERROR'
    }, 500);
  }
};

export const getBlogsByAuthor = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const authorId = c.req.param('authorId')?.trim();

    if (!authorId) {
      return c.json({
        success: false,
        message: 'Author ID parameter is required',
        error: 'MISSING_AUTHOR_ID'
      }, 400);
    }

    const { page, limit, offset } = getPaginationParams(c);

    // Additional filters
    const isPublished = c.req.query('published');
    const status = c.req.query('status')?.toLowerCase();
    const sortBy = c.req.query('sortBy') || 'createdAt';
    const sortOrder = c.req.query('sortOrder')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Build conditions
    const conditions = [eq(blogs.authorId, authorId)];

    if (isPublished !== undefined) conditions.push(eq(blogs.isPublished, isPublished === 'true'));
    if (status) conditions.push(eq(blogs.status, status));

    // Get total count
    const totalCount = await getCount(db, conditions);

    // Dynamic sorting
    const sortColumn = (blogs[sortBy as keyof typeof blogs] || blogs.createdAt) as any;
    const orderFn = sortOrder === 'asc' ? sql`${sortColumn} ASC` : desc(sortColumn);

    // Fetch paginated data
    const results = await db
      .select()
      .from(blogs)
      .where(and(...conditions))
      .orderBy(orderFn)
      .limit(limit)
      .offset(offset)
      .all();

    const parsedResults = results.map(parseBlogData);

    return c.json({
      success: true,
      message: `Fetched ${parsedResults.length} blog post${parsedResults.length !== 1 ? 's' : ''} by author '${authorId}'`,
      data: parsedResults,
      pagination: buildPaginationResponse(page, limit, totalCount),
    });

  } catch (error) {
    console.error('Error fetching blogs by author:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch blog posts by author',
      error: 'FETCH_ERROR'
    }, 500);
  }
};

export const getFeaturedBlogs = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const { page, limit, offset } = getPaginationParams(c);

    // Additional filters
    const category = c.req.query('category')?.trim();
    const isPublished = c.req.query('published');

    // Build conditions
    const conditions = [eq(blogs.isFeatured, true)];

    if (category) conditions.push(eq(blogs.category, category));
    if (isPublished !== undefined) conditions.push(eq(blogs.isPublished, isPublished === 'true'));

    // Get total count
    const totalCount = await getCount(db, conditions);

    // Fetch paginated data - featured blogs sorted by views
    const results = await db
      .select()
      .from(blogs)
      .where(and(...conditions))
      .orderBy(desc(blogs.views), desc(blogs.createdAt))
      .limit(limit)
      .offset(offset)
      .all();

    const parsedResults = results.map(parseBlogData);

    return c.json({
      success: true,
      message: `Fetched ${parsedResults.length} featured blog post${parsedResults.length !== 1 ? 's' : ''}`,
      data: parsedResults,
      pagination: buildPaginationResponse(page, limit, totalCount),
    });

  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch featured blog posts',
      error: 'FETCH_ERROR'
    }, 500);
  }
};