import { useState, useEffect } from 'react'
import {  } from './CompletePage';
// import { API_BASE_URL } from '@acm/api-endpoints';

export interface BlogData {
  id: number;
  blogId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[] | string;
  authorName: string;
  authorId: string | null;
  authorBio: string | null;
  authorProfileImage: string | null;
  featuredImage: string | null;
  featuredImageAltText: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  views: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  estimatedReadTime: number;
  comments: number;
  upvotes: number;
  downvotes: number;
  shares: number;
  status: string;
  externalUrl: string | null;
  relatedBlogs: string[] | string | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: BlogData;
}

const API_BASE_URL = 'https://hono-backend-cms.edventure-park.workers.dev';

const useFetchApi = ({ slug }: { slug?: string }) => {

    const [blog, setBlog] = useState<BlogData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError('Blog slug is required');
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/blog/get/${slug}`);

        if (!response.ok) {
          if (response.status === 404) throw new Error('Blog post not found');
          if (response.status >= 500) throw new Error('Server error. Please try again later.');
          throw new Error(`Error: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success || !result.data) {
          throw new Error(result.message || 'Failed to fetch blog post');
        }

        setBlog(result.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  return (
    { blog, loading, error }
  )
}

export default useFetchApi
