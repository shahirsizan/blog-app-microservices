/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
			// console.log("Single blog: ", data.blog);
			setBlogAuthor(data.author);
			// console.log("Author: ", data.author);
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

	const fetchComments = async () => {
		try {
			setIsPageLoading(true);

			const { data } = await axios.get(
				`${blog_service_base_url}/api/v1/comments/${id}`
			);
			// console.log("data: ", data);

			setComments(data);
			setIsPageLoading(false);
		} catch (error) {
			console.log("❌ error -> fetchComments(): ", error);
			setIsPageLoading(false);
		}
	};

	useEffect(() => {
		fetchComments();
	}, []);

	const addComment = async () => {
		try {
			setIsFuncLoading(true);

			const token = Cookies.get("token");
			const { data } = await axios.post(
				`${blog_service_base_url}/api/v1/comment/${id}`,
				{ comment },
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success(data.message);
			setComment("");
			fetchComments();
		} catch (error: any) {
			toast.error("Problem while adding comment");
			console.log("error -> addComment(): ", error);
		} finally {
			setIsFuncLoading(false);
		}
	};

	const deleteComment = async (id: string) => {
		if (window.confirm("Delete this comment?")) {
			try {
				setIsPageLoading(true);

				const token = Cookies.get("token");
				const { data } = await axios.delete(
					`${blog_service_base_url}/api/v1/comment/${id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				toast.success(data.message);
				fetchComments();
			} catch (error) {
				toast.error("❌ Problem deleting comment!");
				console.log("❌ Problem deleting comment: ", error);
			} finally {
				setIsPageLoading(false);
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
					{/* TITLE */}
					<h1 className="text-3xl font-bold text-gray-900">
						{blog?.title}
					</h1>

					{/* AUTHOR RELATED BUTTONS */}
					<p className="flex items-center text-gray-600 mt-2 ">
						{/* AUTHOR NAME */}
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

						{/* EDIT & DELETE BUTTON (ONLY FOR OWNER) */}
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

				<CardContent>
					<img
						src={blog?.image}
						className="w-full h-72 object-cover rounded-lg mb-4"
					/>

					<p className="text-md font-semibold text-gray-700 mb-6">
						{blog?.description}
					</p>

					<div className="text-lg">{blog?.blogcontent}</div>
				</CardContent>
			</Card>

			{/* LEAVE A COMMENT CARD */}
			<Card>
				<CardHeader>
					<h3 className="text-3xl font-bold text-gray-900">
						Leave a comment
					</h3>
				</CardHeader>

				<CardContent>
					<Label htmlFor="comment">Your Comment</Label>

					<Input
						id="comment"
						placeholder="Type your comment..."
						className="my-2"
						value={comment}
						onChange={(e) => {
							setComment(e.target.value);
						}}
					/>

					<Button
						onClick={() => {
							addComment();
						}}
						disabled={isFuncLoading}
					>
						{isFuncLoading ? "Adding comment..." : "Post Comment"}
					</Button>
				</CardContent>
			</Card>

			{/* ALL COMMENTS CARD */}
			<Card>
				<CardHeader>
					<h3 className="text-lg font-medium">All Comments</h3>
				</CardHeader>

				<CardContent>
					{comments && comments.length > 0 ? (
						comments.map((comment, idx) => {
							return (
								<div
									key={idx}
									className="border-b py-2 flex items-center gap-4"
								>
									{/* COMMENT BODY */}
									<div className="flex flex-col space-y-3">
										<p className="font-semibold flex items-center gap-2">
											<span className="user border border-gray-400 rounded-full p-1">
												<FaUser />
											</span>
											{comment.username}
										</p>

										<p>{comment.comment}</p>

										<p className="text-xs text-gray-500">
											{new Date(
												comment.create_at
											).toLocaleString()}
										</p>
									</div>

									{/* DELETE BUTTON FOR AUTHOR */}
									{comment.userid === user?._id && (
										<Button
											onClick={() =>
												deleteComment(comment.id)
											}
											variant={"destructive"}
											disabled={isFuncLoading}
										>
											<FaRegEdit />
										</Button>
									)}
								</div>
							);
						})
					) : (
						<p>No Comments Yet</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default BlogPage;
