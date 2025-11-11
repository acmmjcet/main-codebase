'use client'
import { Suspense } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Blogs from "@/components/blogs/Landing";

const BlogsPage = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading blogs...</div>}>
        <Blogs />
      </Suspense>
      <Footer />
    </div>
  );
}

export default BlogsPage;