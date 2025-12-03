"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Tag, Eye, ArrowLeft, Share2, Bookmark, ThumbsUp, ThumbsDown, MessageCircle, TrendingUp, ExternalLink } from 'lucide-react';
import BlogHeader from './BlogHeader';
import Link from 'next/link';

const API_BASE_URL = 'https://hono-backend-cms.edventure-park.workers.dev';

interface BlogData {
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

interface ApiResponse {
  success: boolean;
  message: string;
  data: BlogData;
}

interface CompletePageProps {
  slug?: string;
}

const convertMarkdownToHTML = (markdown: string): string => {
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-slate-900 mb-4 mt-8 border-l-4 border-navy-600 pl-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-slate-900 mb-5 mt-10 border-l-4 border-navy-700 pl-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-slate-900 mb-6 mt-12">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto my-6 border border-slate-700"><code class="text-sm font-mono">$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-navy-700 px-2 py-0.5 rounded text-sm font-mono border border-slate-300">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-navy-600 hover:text-navy-800 underline font-medium">$1</a>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-navy-500 bg-slate-50 pl-5 py-3 italic text-slate-700 my-6">$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2 text-slate-700 leading-relaxed list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-slate-700 leading-relaxed">')
    .replace(/\n/g, '<br/>')
    .replace(/^---$/gim, '<hr class="border-t border-slate-300 my-8"/>')
    .replace(/^(?!<[h1-6]|<ul|<ol|<pre|<blockquote|<hr|<li)(.+)/gm, '<p class="mb-4 text-slate-700 leading-relaxed">$1</p>');
};

const formatDate = (dateString: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const CompletePage: React.FC<CompletePageProps> = ({ slug = "deep-tech-transforming-future-ai-quantum-computing" }) => {
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };

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

        if (result.data.relatedBlogs) {
          const blogIds = typeof result.data.relatedBlogs === 'string' 
            ? JSON.parse(result.data.relatedBlogs) 
            : result.data.relatedBlogs;

          if (Array.isArray(blogIds) && blogIds.length > 0) {
            const relatedPromises = blogIds.slice(0, 3).map(async (blogId: string) => {
              try {
                const res = await fetch(`${API_BASE_URL}/blog/get-by-id/${blogId}`);
                if (res.ok) {
                  const data = await res.json();
                  return data.success ? data.data : null;
                }
                return null;
              } catch {
                return null;
              }
            });

            const related = await Promise.all(relatedPromises);
            setRelatedBlogs(related.filter((b): b is BlogData => b !== null));
          }
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <BlogHeader />
        <div className='mx-auto max-w-7xl px-4 pt-2'>
            <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-sm font-semibold text-white"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back to Blogs</span>
            </Link>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="animate-pulse">
            <div className="mb-8 h-12 w-3/4 rounded bg-slate-200"></div>
            <div className="mb-6 h-96 rounded-lg bg-slate-200"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 rounded bg-slate-200" style={{ width: `${100 - i * 10}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
      <BlogHeader />
      <div className='mx-auto max-w-7xl px-4 pt-2'>
            <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-sm font-semibold text-white"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back to Blogs</span>
            </Link>
      </div>
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-8">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <ArrowLeft className="size-6 text-red-600" />
              </div>
            </div>
            <h2 className="mb-3 text-xl font-bold text-red-900">Error Loading Blog</h2>
            <p className="mb-6 text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
              <BlogHeader />
      <div className='mx-auto max-w-7xl px-4 pt-2'>
            <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-sm font-semibold text-white"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back to Blogs</span>
            </Link>
      </div>
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-slate-800">Blog Not Found</h2>
          <p className="text-slate-600">The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  const parsedTags = typeof blog.tags === 'string' ? blog.tags.split(',').map(t => t.trim()) : blog.tags;

  return (
    <div className="min-h-screen bg-white">
      <BlogHeader />
      <div className='mx-auto max-w-7xl px-4 pt-2'>
            <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-sm font-semibold text-white"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back to Blogs</span>
            </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Category Badge */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                {blog.category}
              </span>
              {blog.isFeatured && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-700 px-3 py-1 text-sm font-semibold text-white">
                  <TrendingUp size={14} />
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="mb-8 border-l-4 border-slate-900 bg-slate-50 py-3 pl-5 text-lg leading-relaxed text-slate-700">
                {blog.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="mb-8 flex flex-wrap items-center gap-4 border-y border-slate-200 py-5 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-100">
                  <User size={16} className="text-slate-700" />
                </div>
                <span className="font-medium text-slate-900">{blog.authorName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>{blog.estimatedReadTime || Math.ceil(blog.content.length / 1000)} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={16} />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-10 overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={blog.featuredImage}
                  alt={blog.featuredImageAltText || blog.title}
                  className="h-auto w-full object-cover md:h-96"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="mb-10 rounded-lg border border-slate-200 bg-white p-6 md:p-10">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: convertMarkdownToHTML(blog.content) 
                }}
              />
            </div>

            {/* External URL */}
            {blog.externalUrl && (
              <div className="mb-8 rounded-lg border border-slate-300 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 font-semibold text-slate-900">Continue Reading</h4>
                    <p className="text-sm text-slate-600">Read the full article on the original source</p>
                  </div>
                  <a
                    href={blog.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Visit <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {/* Engagement Section */}
            <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote('up')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${
                      userVote === 'up'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    <ThumbsUp size={16} />
                    <span className="text-sm">{blog.upvotes + (userVote === 'up' ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => handleVote('down')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${
                      userVote === 'down'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    <ThumbsDown size={16} />
                    <span className="text-sm">{blog.downvotes + (userVote === 'down' ? 1 : 0)}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleShare()} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                    <Share2 size={16} />
                    <span className="text-sm">Share</span>
                  </button>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${
                      isBookmarked
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark size={16} />
                    <span className="text-sm">Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            {parsedTags && parsedTags.length > 0 && (
              <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Tag size={20} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedTags.map((tag, index) => (
                    <span 
                      key={index}
                      className="cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Section */}
            <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-5 text-lg font-bold text-slate-900">About the Author</h3>
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                {blog.authorProfileImage ? (
                  <img
                    src={blog.authorProfileImage}
                    alt={blog.authorName}
                    className="size-16 rounded-full border-2 border-slate-300 object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-900 text-xl font-bold text-white">
                    {blog.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="mb-2 text-lg font-bold text-slate-900">{blog.authorName}</h4>
                  <p className="leading-relaxed text-slate-700">
                    {blog.authorBio || "Content creator passionate about technology and knowledge sharing."}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <MessageCircle size={20} />
                Comments ({blog.comments})
              </h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                <MessageCircle size={40} className="mx-auto mb-3 text-slate-400" />
                <p className="font-medium text-slate-700">Comments section coming soon</p>
                <p className="mt-1 text-sm text-slate-500">Join the conversation when we launch this feature</p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className='sticky top-24 space-y-6'>
            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Related Articles</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((related) => (
                    <a key={related.blogId} href={`/blog/${related.slug}`}>
                      <div className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-900 hover:shadow-md">
                        {related.featuredImage && (
                          <div className="mb-3 overflow-hidden rounded">
                            <img
                              src={related.featuredImage}
                              alt={related.title}
                              className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <h4 className="mb-2 line-clamp-2 font-bold text-slate-900 group-hover:text-slate-700">
                          {related.title}
                        </h4>
                        {related.excerpt && (
                          <p className="line-clamp-2 text-sm text-slate-600">{related.excerpt}</p>
                        )}
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {related.estimatedReadTime || Math.ceil(related.content.length / 1000)} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {related.views}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Share Widget */}
            {/* <div className="rounded-lg border border-slate-200 bg-slate-900 p-5 text-white">
              <h3 className="mb-4 font-bold">Share this article</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20">
                  Twitter
                </button>
                <button className="rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20">
                  Facebook
                </button>
                <button className="rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20">
                  LinkedIn
                </button>
                <button className="rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20">
                  Copy Link
                </button>
              </div>
            </div> */}

            {/* ACM Info Box */}
            <div className="rounded-lg border-2 border-slate-900 bg-slate-50 p-5">
              <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
                ACM
              </div>
              <h3 className="mb-2 font-bold text-slate-900">ACM MJCET</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                Association for Computing Machinery - MJCET Student Chapter. Empowering future tech leaders.
              </p>
              <button onClick={() => window.location.href = "/join"} className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800">
                Join Our Community
              </button>
            </div>
          </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-600">
          <p>&copy; 2025 ACM MJCET Student Chapter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CompletePage;