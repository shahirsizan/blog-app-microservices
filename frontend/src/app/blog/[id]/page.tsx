/* eslint-disable @next/next/no-img-element */
"use client";

import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	AppContext,
	author_service_base_url,
	blog_service_base_url,
} from "@/context/AppContext";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Comment = {
	id: string;
	userid: string;
	username: string;
	comment: string;
	create_at: string;
};

type User = {
	_id: string;
	name: string;
	email: string;
	image: string;
	bio: string;
};

type Blog = {
	id: string;
	author: string;
	created_at: string;
	title: string;
	description: string;
	blogcontent: string;
	image: string;
	category: string;
};

const BlogPage = () => {
	const { isAuthenticated, user, fetchBlogs } = useContext(AppContext);
	const router = useRouter();
	const { id } = useParams();
	const [blog, setBlog] = useState<Blog | null>(null);
	const [blogAuthor, setBlogAuthor] = useState<User | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [comment, setComment] = useState("");
	const [isSaved, setIsSaved] = useState(false);
	const [isBlogAvailable, setIsBlogAvailable] = useState(true);
	const [isFuncLoading, setIsFuncLoading] = useState(false);
	const [isPageLoading, setIsPageLoading] = useState(true);

	const fetchSingleBlog = async () => {
		try {
			setIsPageLoading(true);

			const { data } = await axios.get(
				`${blog_service_base_url}/api/v1/blog/${id}`
			);

			// after fetching the `blog` and the `author` separately,
			// response from backend is:
			// 		const responseData = { blog: blog[0], author: data };
			// 		res.json(responseData);
			setBlog(data.blog);
			console.log("Single blog: ", data.blog);
			setBlogAuthor(data.author);
			console.log("Author: ", data.author);
		} catch (error: any) {
			console.log("❌ error -> fetchSingleBlog(): ", error);
			if (error.response.status === 404) {
				setIsBlogAvailable(false);
			}
		} finally {
			setIsPageLoading(false);
		}
	};

	useEffect(() => {
		fetchSingleBlog();
	}, []);

	const deleteBlog = async () => {
		if (window.confirm("Delete this blog?")) {
			try {
				setIsFuncLoading(true);

				const token = Cookies.get("token");
				const { data } = await axios.delete(
					`${author_service_base_url}/api/v1/blog/${id}`,
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					}
				);
				toast.success(data.message);
				setIsFuncLoading(false);
				router.push("/blogs");
			} catch (error: any) {
				toast.error("Problem while deleting blog!");
				if (error.response.status >= 400) {
					setIsBlogAvailable(false);
				}
				console.log("error -> deleteBlog(): ", error);
				setIsFuncLoading(false);
			}
		}
	};

	if (isPageLoading) {
		return <Loading />;
	}

	if (!isBlogAvailable) {
		return <h1>Blog not available!</h1>;
	}

	return (
		<div className="px-[5vw] md:px-[8vw] lg:px-[12vw] pt-14 space-y-6">
			{/* BLOG CARD */}
			<Card>
				<CardHeader>
					<h1 className="text-3xl font-bold text-gray-900">
						{blog?.title}
					</h1>

					<p className="flex items-center text-gray-600 mt-2 ">
						<Link
							className="flex items-center gap-2"
							href={`/profile/${blogAuthor?._id}`}
						>
							<img
								src={blogAuthor?.image}
								className="w-8 h-8 rounded-full"
								alt="blogauthor image"
							/>
							{blogAuthor?.name}
						</Link>

						{/* SAVE/UNSAVE BUTTON */}
						{isAuthenticated && (
							<Button
								variant={"ghost"}
								className="mx-3"
								size={"lg"}
								disabled={isFuncLoading}
								onClick={() => {
									let x: int = 10;
									// saveBlog();
								}}
							>
								{isSaved ? <FaBookmark /> : <FaRegBookmark />}
							</Button>
						)}

						{/* DELETE BUTTON (ONLY FOR OWNER) */}
						{blog?.author === user?._id && (
							<>
								<Button
									size={"sm"}
									onClick={() => {
										router.push(`/blog/edit/${id}`);
									}}
								>
									<FaRegEdit />
								</Button>

								<Button
									variant={"destructive"}
									className="mx-2"
									size={"sm"}
									onClick={deleteBlog}
									disabled={isFuncLoading}
								>
									<MdOutlineDeleteForever />
								</Button>
							</>
						)}
					</p>
				</CardHeader>

				<CardContent></CardContent>
			</Card>

			{/* LEAVE A COMMENT CARD */}
			<Card></Card>

			{/* ALL COMMENTS CARD */}
			<Card></Card>
		</div>
	);
};

export default BlogPage;
