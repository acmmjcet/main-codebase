import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Blogs from "@/components/blogs/Landing";

function BlogsPage() {
  return (
    <>
        <Navbar />
        {/* <div className="py-8">
            <Suspense fallback={<div>Loading blogs...</div>}>
                <div className="blogs-container">
                    <Blogs />
                </div>
            </Suspense>
        </div> */}
        <Blogs/>
        <Footer />
    </>
  );
}

export default BlogsPage;
