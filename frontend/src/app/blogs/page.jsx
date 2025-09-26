"use client";

import BlogCard from "@/components/BlogCard";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect } from "react";

const BlogsPage = () => {
	const { toggleSidebar } = useSidebar();
	const { fetchBlogs, isBlogLoading, blogs } = useContext(AppContext);

	useEffect(() => {
		fetchBlogs();
	}, []);

	return (
		<div>
			{isBlogLoading ? (
				<Loading />
			) : (
				<div className="">
					{/* TITLE & BUTTON */}
					<div className="flex justify-between items-center my-5">
						{/* TITLE */}
						<h1 className="text-3xl font-bold">Latest Blogs</h1>

						{/* TOGGLE SIDEBAR BUTTON */}
						<Button
							onClick={toggleSidebar}
							className="flex items-center gap-2 px-4 bg-primary text-white"
						>
							<span>Filter Blogs</span>
						</Button>
					</div>

					{/* BLOGS */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
						{blogs?.length === 0 && <p>No Blogs Yet</p>}
						{blogs?.map((blog, idx) => {
							return (
								<BlogCard
									key={idx}
									image={blog.image}
									title={blog.title}
									desc={blog.description}
									id={blog.id}
									time={blog.created_at}
								/>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default BlogsPage;
