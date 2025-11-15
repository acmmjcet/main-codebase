import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { blogs } from '../../db/schema';
import type { Context } from 'hono';

// Shared utilities
const validateSlug = (slug: string): boolean => 
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 200;

// Delete blog post by ID
export const deleteBlogById = async (c: Context) => {
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

    // Check if blog exists
    const existingBlog = await db
      .select({ 
        id: blogs.id, 
        blogId: blogs.blogId, 
        slug: blogs.slug, 
        title: blogs.title 
      })
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

    // Perform deletion
    const result = await db
      .delete(blogs)
      .where(eq(blogs.blogId, blogId))
      .returning({ id: blogs.id });

    if (!result?.length) {
      return c.json({
        success: false,
        message: 'Failed to delete blog post',
        error: 'DELETE_FAILED'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Blog post deleted successfully',
      data: {
        blogId: existingBlog.blogId,
        slug: existingBlog.slug,
        title: existingBlog.title,
        deletedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error deleting blog post by ID:', error);
    return c.json({
      success: false,
      message: 'Failed to delete blog post',
      error: 'INTERNAL_SERVER_ERROR'
    }, 500);
  }
};

// Delete blog post by slug
export const deleteBlogBySlug = async (c: Context) => {
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

    // Check if blog exists
    const existingBlog = await db
      .select({ 
        id: blogs.id, 
        blogId: blogs.blogId, 
        slug: blogs.slug, 
        title: blogs.title 
      })
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1)
      .then(res => res[0]);

    if (!existingBlog) {
      return c.json({
        success: false,
        message: `Blog post with slug '${slug}' not found`,
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    // Perform deletion
    const result = await db
      .delete(blogs)
      .where(eq(blogs.slug, slug))
      .returning({ id: blogs.id });

    if (!result?.length) {
      return c.json({
        success: false,
        message: 'Failed to delete blog post',
        error: 'DELETE_FAILED'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Blog post deleted successfully',
      data: {
        blogId: existingBlog.blogId,
        slug: existingBlog.slug,
        title: existingBlog.title,
        deletedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error deleting blog post by slug:', error);
    return c.json({
      success: false,
      message: 'Failed to delete blog post',
      error: 'INTERNAL_SERVER_ERROR'
    }, 500);
  }
};

// Soft delete - Mark as archived instead of deleting
export const archiveBlogById = async (c: Context) => {
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

    // Check if blog exists
    const existingBlog = await db
      .select({ id: blogs.id, status: blogs.status })
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

    if (existingBlog.status === 'archived') {
      return c.json({
        success: false,
        message: 'Blog post is already archived',
        error: 'ALREADY_ARCHIVED'
      }, 400);
    }

    // Update to archived status
    const result = await db
      .update(blogs)
      .set({ 
        status: 'archived',
        isPublished: false,
        updatedAt: new Date().toISOString()
      })
      .where(eq(blogs.blogId, blogId))
      .returning({ 
        blogId: blogs.blogId, 
        slug: blogs.slug, 
        title: blogs.title,
        status: blogs.status
      });

    if (!result?.length) {
      return c.json({
        success: false,
        message: 'Failed to archive blog post',
        error: 'ARCHIVE_FAILED'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Blog post archived successfully',
      data: {
        blogId: result[0].blogId,
        slug: result[0].slug,
        title: result[0].title,
        status: result[0].status,
        archivedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error archiving blog post:', error);
    return c.json({
      success: false,
      message: 'Failed to archive blog post',
      error: 'INTERNAL_SERVER_ERROR'
    }, 500);
  }
};

// Soft delete - Archive by slug
export const archiveBlogBySlug = async (c: Context) => {
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

    // Check if blog exists
    const existingBlog = await db
      .select({ id: blogs.id, blogId: blogs.blogId, status: blogs.status })
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1)
      .then(res => res[0]);

    if (!existingBlog) {
      return c.json({
        success: false,
        message: `Blog post with slug '${slug}' not found`,
        error: 'BLOG_NOT_FOUND'
      }, 404);
    }

    if (existingBlog.status === 'archived') {
      return c.json({
        success: false,
        message: 'Blog post is already archived',
        error: 'ALREADY_ARCHIVED'
      }, 400);
    }

    // Update to archived status
    const result = await db
      .update(blogs)
      .set({ 
        status: 'archived',
        isPublished: false,
        updatedAt: new Date().toISOString()
      })
      .where(eq(blogs.slug, slug))
      .returning({ 
        blogId: blogs.blogId, 
        slug: blogs.slug, 
        title: blogs.title,
        status: blogs.status
      });

    if (!result?.length) {
      return c.json({
        success: false,
        message: 'Failed to archive blog post',
        error: 'ARCHIVE_FAILED'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Blog post archived successfully',
      data: {
        blogId: result[0].blogId,
        slug: result[0].slug,
        title: result[0].title,
        status: result[0].status,
        archivedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error archiving blog post by slug:', error);
    return c.json({
      success: false,
      message: 'Failed to archive blog post',
      error: 'INTERNAL_SERVER_ERROR'
    }, 500);
  }
};

// Restore archived blog
export const restoreBlogById = async (c: Context) => {
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

    // Check if blog exists and is archived
    const existingBlog = await db
      .select({ id: blogs.id, status: blogs.status })
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

    if (existingBlog.status !== 'archived') {
      return c.json({
        success: false,
        message: 'Blog post is not archived',
        error: 'NOT_ARCHIVED'
      }, 400);
    }

    // Restore to draft status
    const result = await db
      .update(blogs)
      .set({ 
        status: 'draft',
        updatedAt: new Date().toISOString()
      })
      .where(eq(blogs.blogId, blogId))
      .returning({ 
        blogId: blogs.blogId, 
        slug: blogs.slug, 
        title: blogs.title,
        status: blogs.status
      });

    if (!result?.length) {
      return c.json({
        success: false,
        message: 'Failed to restore blog post',
        error: 'RESTORE_FAILED'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Blog post restored successfully',
      data: {
        blogId: result[0].blogId,
        slug: result[0].slug,
        title: result[0].title,
        status: result[0].status,
        restoredAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error restoring blog post:', error);
    return c.json({
      success: false,
      message: 'Failed to restore blog post',
      error: 'INTERNAL_SERVER_ERROR'
    }, 500);
  }
};