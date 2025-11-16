"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Clock, TrendingUp, Calendar, Eye, ArrowRight } from "lucide-react";

// Types
interface Blog {
  blogId: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorName: string;
  featuredImage: string;
  featuredImageAltText: string;
  estimatedReadTime: number;
  publishedAt: string;
  views: number;
  isFeatured: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Blog[];
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://hono-backend-cms.edventure-park.workers.dev/blog/get-all"
        );
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const result: ApiResponse = await response.json();
        if (result.success && result.data) {
          setBlogs(result.data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(blogs.map((blog) => blog.category));
    return ["all", ...Array.from(cats)];
  }, [blogs]);

  // Filter blogs based on search and category
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  // Sort: featured first, then by published date
  const sortedBlogs = useMemo(() => {
    return [...filteredBlogs].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [filteredBlogs]);

  // Get random 3-4 tags
  const getRandomTags = (tags: string[]) => {
    const count = Math.min(tags.length, Math.floor(Math.random() * 2) + 3);
    return tags.slice(0, count);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
                ACM
              </div>
              <div>
                <div className="text-lg font-bold leading-tight text-slate-900">ACM MJCET</div>
                <div className="text-xs text-slate-600">Student Chapter</div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 h-12 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mb-8 h-12 w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="h-56 w-full animate-pulse bg-slate-200" />
                <div className="space-y-3 p-6">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Oops! Something went wrong
          </h2>
          <p className="mb-6 text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ACM Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
              ACM
            </div>
            <div>
              <div className="text-lg font-bold leading-tight text-slate-900">ACM MJCET</div>
              <div className="text-xs text-slate-600">Student Chapter</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Blog Articles
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Insights, tutorials, and stories from the ACM MJCET community
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              className="w-full rounded-lg border-2 border-slate-200 bg-white py-3.5 pl-12 pr-24 text-slate-900 transition-all placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex h-8 w-16 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-100 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <X className="mr-1 size-4" />
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{sortedBlogs.length}</span> of{" "}
          <span className="font-semibold text-slate-900">{blogs.length}</span> articles
        </div>

        {/* Blog Grid */}
        {sortedBlogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedBlogs.map((blog) => {
              const displayTags = getRandomTags(blog.tags);

              return (
                <article
                  key={blog.blogId}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:border-slate-900 hover:shadow-lg"
                >
                  {/* Featured Badge */}
                  {blog.isFeatured && (
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                      <TrendingUp className="size-3" />
                      Featured
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                    <img
                      src={blog.featuredImage}
                      alt={blog.featuredImageAltText || blog.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/600x400?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Category */}
                    <div className="mb-3">
                      <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {blog.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-slate-700">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {blog.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {formatDate(blog.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {blog.estimatedReadTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {blog.views}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {displayTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Read More */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm text-slate-600">
                        By <span className="font-semibold text-slate-900">{blog.authorName}</span>
                      </span>
                      <a
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:gap-2 hover:bg-slate-800"
                      >
                        Read
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 py-20 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">
              No articles found
            </h3>
            <p className="mb-6 text-slate-600">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Blogs;