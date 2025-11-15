import { Hono } from 'hono';
import { createBlogPost } from '../controllers/blogs/create';
import { getAllBlogs, getBlogById, getBlogBySlug, getBlogsByAuthor, getBlogsByCategory, getFeaturedBlogs } from '../controllers/blogs/fetch';
import { incrementBlogViews, toggleBlogPublish, updateBlogById, updateBlogEngagement } from '../controllers/blogs/update';
import { deleteBlogById, deleteBlogBySlug, archiveBlogById, archiveBlogBySlug, restoreBlogById } from '../controllers/blogs/delete';

const blogRoutes = new Hono();

blogRoutes.post('/create-post', createBlogPost);

// GET ROUTES
blogRoutes.get('/get-all', getAllBlogs);
blogRoutes.get('/get/:slug', getBlogBySlug);
blogRoutes.get('/category/:category', getBlogsByCategory);
blogRoutes.get('/get-by-id/:blogId',getBlogById);
blogRoutes.get('/get-by-author/:authorId',getBlogsByAuthor); // fetches all the blogs by a specific author
blogRoutes.get('/featured',getFeaturedBlogs);

// UPDATE AND DELETE ROUTES
blogRoutes.patch('/update/:blogId',updateBlogById);
blogRoutes.patch('/update/views/:blogId',incrementBlogViews);
blogRoutes.patch('/update/engagement/:blogId',updateBlogEngagement);
blogRoutes.patch('/toggle/publish/:blogId',toggleBlogPublish);

// DELETE ROUTES - Hard delete (permanent)
blogRoutes.delete('/delete/:blogId', deleteBlogById);
blogRoutes.delete('/delete/slug/:slug', deleteBlogBySlug);

// DELETE ROUTES - Soft delete (archive)
blogRoutes.patch('/archive/:blogId', archiveBlogById);
blogRoutes.patch('/archive/slug/:slug', archiveBlogBySlug);
blogRoutes.patch('/restore/:blogId', restoreBlogById);

export default blogRoutes;