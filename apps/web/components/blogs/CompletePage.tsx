"use client";
import React, { useState } from 'react';
import { Calendar, Clock, User, Tag, Eye, ArrowLeft, Share2, Bookmark, ThumbsUp, ThumbsDown, MessageCircle, TrendingUp, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Navbar from '../Navbar';
import Footer from '../Footer';
import useFetchApi from './useFetchApi';
import { API_BASE_URL } from '@acm/api-endpoints';

export interface CompletePageProps {
  slug?: string;
}

const convertMarkdownToHTML = (markdown: string): string => {
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-200 mb-4 mt-8">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-200 mb-5 mt-10">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-200 mb-6 mt-12">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-200">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-400">$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 rounded-xl p-5 overflow-x-auto my-6 shadow-lg"><code class="text-sm font-mono">$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-700">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gray-200 hover:text-white underline font-medium">$1</a>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-700 bg-gray-900/50 pl-6 py-3 italic text-gray-400 my-6 rounded-r-lg">$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-3 text-gray-400 leading-relaxed">• $1</li>')
    .replace(/\n\n/g, '</p><p class="mb-5 text-gray-400 leading-relaxed text-lg">')
    .replace(/\n/g, '<br/>')
    .replace(/^---$/gim, '<hr class="border-t-2 border-gray-700 my-10"/>')
    .replace(/^(?!<[h1-6]|<ul|<ol|<pre|<blockquote|<hr|<li)(.+)/gm, '<p class="mb-5 text-gray-400 leading-relaxed text-lg">$1</p>');
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

const generateMetadata = async ({ slug }: CompletePageProps) => {
  
  const { blog, error } = useFetchApi({ slug });
  const url = typeof window !== 'undefined' ? window.location.href : '';

  if (error) {
    console.error('Error fetching blog for metadata:', error);
    return;
  }

  return {
    title: blog?.title,
    description: blog?.excerpt,
    openGraph: {
      title: blog?.title,
      description: blog?.excerpt,
      url: url,
      images: [
        {
          url: blog?.featuredImage,
          width: 1200,
          height: 630,
          alt: blog?.title,
        },
      ],
    }
  };
};

const CompletePage: React.FC<CompletePageProps> = ({ slug }: CompletePageProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const { blog, loading, error } = useFetchApi({ slug });

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
    }
  };

    const handleShare = async () => {
    const shareData = {
      url: typeof window !== "undefined" ? window.location.href : "",
      title: blog?.title || "",
    };

    try {
      if (navigator.share) {
        // Use native share on mobile and supported browsers
        await navigator.share(shareData);
        console.log("Shared successfully!");

        // Optionally, you can call your backend to increment the share count
        // await fetch(`${API_BASE_URL}/blog/share/${blog?.id}`, { method: "POST" });

      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert("🔗 Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="animate-pulse">
            <div className="mb-8 h-12 w-3/4 rounded-lg bg-gray-800"></div>
            <div className="mb-6 h-96 rounded-2xl bg-gray-800"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 rounded bg-gray-800" style={{ width: `${100 - i * 10}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-200">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gray-800 p-4">
                <ArrowLeft className="size-8 text-gray-200" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-200">Error Loading Blog</h2>
            <p className="mb-6 text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-700 hover:shadow-lg"
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
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-200">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-200">Blog Not Found</h2>
          <p className="text-gray-400">The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  const parsedTags = typeof blog.tags === 'string' ? blog.tags.split(',').map(t => t.trim()) : blog.tags;

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-10">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Category & Status Badges */}
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-4 py-1.5 text-sm font-semibold text-gray-200 shadow-lg">
                {blog.category}
              </span>
              {blog.isFeatured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-4 py-1.5 text-sm font-semibold text-gray-200 shadow-lg">
                  <TrendingUp size={14} />
                  Featured
                </span>
              )}
              {blog.status === 'draft' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-600 px-4 py-1.5 text-sm font-semibold text-white">
                  Draft
                </span>
              )}
            </div>
            {/* Title */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              {blog.title}
            </h1>
            {/* Excerpt */}
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className=" overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  width={1200}
                  height={600}
                  src={blog.featuredImage}
                  alt={blog.featuredImageAltText || blog.title}
                  className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-96 lg:h-[500px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            {/* Meta Information */}
            <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-gray-700 py-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-gray-800 p-2">
                  <User size={16} className="text-gray-200" />
                </div>
                <span className="font-medium text-gray-200">{blog.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-400">{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-gray-400">{blog.estimatedReadTime || Math.ceil(blog.content.length / 1000)} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-gray-400" />
                <span className="text-gray-400">{blog.views.toLocaleString()} views</span>
              </div>
            </div>
            {/* Blog Content */}
            <div className="mb-12 rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-lg md:p-12">
              <div 
                className="prose prose-lg prose-blue max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: convertMarkdownToHTML(blog.content) 
                }}
              />
            </div>
            {/* External URL */}
            {blog.externalUrl && (
              <div className="mb-8 rounded-2xl bg-gray-800 p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-2 text-lg font-semibold">Read More</h4>
                    <p className="text-sm opacity-90">Continue reading on the original source</p>
                  </div>
                  <a
                    href={blog.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg"
                  >
                    Visit <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            )}
            {/* Engagement Section */}
            <div className="mb-10 rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVote('up')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition-all ${
                      userVote === 'up'
                        ? 'bg-gray-700 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    <ThumbsUp size={18} />
                    {blog.upvotes + (userVote === 'up' ? 1 : 0)}
                  </button>
                  <button
                    onClick={() => handleVote('down')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition-all ${
                      userVote === 'down'
                        ? 'bg-gray-700 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    <ThumbsDown size={18} />
                    {blog.downvotes + (userVote === 'down' ? 1 : 0)}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleShare} className="flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-2.5 font-semibold text-white transition-all hover:bg-gray-700 hover:shadow-lg">
                    <Share2 size={18} />
                    Share ({blog.shares})
                  </button>
                  <button  className="flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-2.5 font-semibold text-white transition-all hover:bg-gray-700 hover:shadow-lg">
                    <Bookmark size={18} />
                    Save
                  </button>
                </div>
              </div>
            </div>
            {/* Tags */}
            {parsedTags && parsedTags.length > 0 && (
              <div className="mb-10 rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-lg">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-200">
                  <Tag size={22} className="text-gray-200" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedTags.map((tag, index) => (
                    <span 
                      key={index}
                      className="cursor-pointer rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-all hover:bg-gray-700 hover:shadow-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Author Section */}
            <div className="mb-10 rounded-2xl bg-gray-800 p-8 text-gray-200 shadow-2xl">
              <h3 className="mb-5 text-2xl font-bold">About the Author</h3>
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                {blog.authorProfileImage ? (
                  <Image
                    width={80}
                    height={80}
                    src={blog.authorProfileImage}
                    alt={blog.authorName}
                    className="size-20 rounded-full border-4 border-gray-700 object-cover shadow-xl"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full border-4 border-gray-700 bg-gray-700 text-2xl font-bold text-gray-200 shadow-xl">
                    {blog.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="mb-2 text-xl font-bold text-gray-200">{blog.authorName}</h4>
                  {blog.authorBio ? (
                    <p className="leading-relaxed opacity-95 text-gray-400">{blog.authorBio}</p>
                  ) : (
                    <p className="leading-relaxed opacity-95 text-gray-400">
                      Content creator passionate about sharing knowledge and helping developers grow.
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Comments Section Placeholder */}
            {/* Sidebar */}
          </article>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CompletePage;
