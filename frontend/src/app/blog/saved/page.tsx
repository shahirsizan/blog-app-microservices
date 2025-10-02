/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import Loading from "@/components/loading";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import { blog_service_base_url } from "@/context/AppContext";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import moment from "moment";
import { FaCalendarAlt } from "react-icons/fa";

const SavedBlogs = () => {
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [savedBlogs, setSavedBlogs] = useState([]);

	const getSavedBlogs = async () => {
		const token = Cookies.get("token");

		try {
			const { data } = await axios.get(
				`${blog_service_base_url}/api/v1/blog/saved/all`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			const blogs = data.blogs;
			console.log("blogs: ", blogs);

			setSavedBlogs(blogs);
		} catch (error: any) {
			toast.error("Error fetching savedblogs!");
			console.log("❌ error -> getSavedBlogs(): ", error);
		} finally {
			setIsPageLoading(false);
		}
	};

	useEffect(() => {
		getSavedBlogs();
	}, []);

	if (isPageLoading) {
		return <Loading />;
	}

	if (savedBlogs?.length === 0) {
		return (
			<div className="h-screen flex items-center justify-center">
				<h1>No blogs saved!</h1>
			</div>
		);
	}

	return (
		<div className="px-[5vw] md:px-[8vw] lg:px-[12vw]">
			<h1 className="text-3xl font-bold mt-2">Saved Blogs</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
				{savedBlogs.length > 0 &&
					savedBlogs.map((item: any, idx: any) => {
						return (
							<Link key={idx} href={`/blog/${item.id}`}>
								<Card className="overflow-hidden rounded-lg shadow-none transition-shadow duration-300 hover:shadow-xl border-none">
									<div className="w-full h-[200px]">
										<img
											src={item.image}
											className="w-full h-full object-cover"
										/>
									</div>

									<div className="p-0">
										<div>
											<p className="flex items-center justify-center gap-2 text-sm text-gray-500">
												<FaCalendarAlt className="w-4 h-4" />
												<span>
													{moment(
														item.create_at
													).format("DD-MM-YYYY")}
												</span>
											</p>
											<h2 className="text-lg font-semibold mt-1 line-clamp-1 text-center">
												{item.title}
											</h2>
											<p className="text-center">
												{item.description.slice(0, 30)}
												...
											</p>
										</div>
									</div>
								</Card>
							</Link>
						);
					})}
			</div>
		</div>
	);
};

export default SavedBlogs;
