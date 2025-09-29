/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2";
import {
	Select,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	AppContext,
	author_service_base_url,
	blog_service_base_url,
} from "@/context/AppContext";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/loading";

type Blog = {
	authorId: string;
	title: string;
	description: string;
	category: string;
	image: string | File;
	blogcontent: string;
};

const EditBlog = () => {
	const { id } = useParams();
	const { blogCategories } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [formData, setFormData] = useState<Blog>({
		authorId: "",
		title: "",
		description: "",
		category: "",
		image: "",
		blogcontent: "",
	});

	const fetchBlog = async () => {
		try {
			setIsLoading(true);

			const { data } = await axios.get<{ blog: Blog; author: any }>(
				`${blog_service_base_url}/api/v1/blog/${id}`
			);
			const blog = data.blog;
			const author = data.author;

			setFormData({
				authorId: author._id,
				title: blog.title,
				description: blog.description,
				category: blog.category,
				image: blog.image,
				blogcontent: blog.blogcontent,
			});
			// console.log("fetched blog data: ", data);
		} catch (err) {
			console.error("error -> fetchBlog(): ", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			fetchBlog();
		}
	}, []);

	const handleFormSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);

		const formaDataObj = new FormData();
		formaDataObj.append("authorId", formData.authorId);
		formaDataObj.append("title", formData.title);
		formaDataObj.append("description", formData.description);
		formaDataObj.append("blogcontent", formData.blogcontent);
		formaDataObj.append("category", formData.category);
		if (formData.image) {
			formaDataObj.append("file", formData.image);
			// this is what multer middleware looks like:
			// const uploadFile = multer({ storage }).single("file");
		}

		try {
			const token = Cookies.get("token");

			const { data } = await axios.post(
				`${author_service_base_url}/api/v1/blog/${id}`,
				formaDataObj,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			// response from backend is:
			// 	res.json({
			// 	message: "Blog Updated",
			// 	blog: updatedBlog[0],
			// });

			// console.log("updated blog: ", data.blog);

			toast.success(data.message);
			setFormData({
				authorId: "",
				title: "",
				description: "",
				category: "",
				image: "",
				blogcontent: "",
			});
			router.push(`/blog/${id}`);
		} catch (error: any) {
			console.log("❌ Error in AddBlog: ", error);
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="py-6 px-[5vw] md:px-[8vw] lg:px-[12vw]">
			<Card>
				<CardHeader>
					<h2 className="text-2xl font-bold">Edit Blog</h2>
				</CardHeader>

				<CardContent>
					<form
						className="space-y-4"
						onSubmit={(e) => {
							handleFormSubmit(e);
						}}
					>
						{/* TITLE */}
						<Label>Title</Label>
						<div className="flex justify-center items-center gap-2">
							<Input
								name="title"
								value={formData.title}
								placeholder="Enter Blog title"
								required
								onChange={(e) => {
									setFormData((prev) => {
										return {
											...prev,
											[e.target.name]: e.target.value,
										};
									});
								}}
							/>
						</div>

						{/* DESCRIPTION */}
						<Label>Description</Label>
						<div className="flex justify-center items-center gap-2">
							<Input
								name="description"
								value={formData.description}
								placeholder="Enter Blog descripiton"
								required
								onChange={(e) => {
									setFormData((prev) => {
										return {
											...prev,
											[e.target.name]: e.target.value,
										};
									});
								}}
							/>
						</div>

						{/* CATEGORY SELECT LIST */}
						<Label>Category</Label>
						<Select
							onValueChange={(newValue) => {
								setFormData((prev) => {
									return { ...prev, category: newValue };
								});
							}}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={
										formData.category || "Select category"
									}
								></SelectValue>
							</SelectTrigger>

							<SelectContent>
								{blogCategories.map(
									(item: string, idx: any) => {
										return (
											<SelectItem key={idx} value={item}>
												{item}
											</SelectItem>
										);
									}
								)}
							</SelectContent>
						</Select>

						{/* IMAGE UPLOAD */}
						<div>
							<Label>Upload Image</Label>
							<br />
							{formData.image && (
								<img
									src={
										typeof formData.image === "string"
											? formData.image
											: URL.createObjectURL(
													formData.image
												)
									}
									className="w-40 h-40 object-cover rounded mb-2"
								/>
							)}

							<Input
								className="max-w-fit"
								type="file"
								accept="image/*"
								onChange={(e) => {
									setFormData((prev) => {
										return {
											...prev,
											image: e.target.files[0],
										};
									});
								}}
							/>
						</div>

						{/* BLOG CONTENT */}
						<div>
							<Label>Blog Content</Label>
							<div className="flex justify-between items-center mb-2">
								<p className="text-sm text-gray-400">
									Write your blog here.
								</p>
							</div>

							<Textarea
								value={formData.blogcontent}
								onChange={(e) => {
									setFormData((prev) => {
										return {
											...prev,
											blogcontent: e.target.value,
										};
									});
								}}
							/>
						</div>

						{/* SUBMIT BUTTON */}
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? "Submitting" : "Submit"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default EditBlog;
