"use client";

import React, { useContext, useState } from "react";
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
import { AppContext, author_service_base_url } from "@/context/AppContext";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

const AddBlog = () => {
	const { blogCategories } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		image: null,
		blogcontent: "",
	});
	console.log(formData);

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const formaDataObj = new FormData();
		formaDataObj.append("title", formData.title);
		formaDataObj.append("description", formData.description);
		formaDataObj.append("blogcontent", formData.blogcontent);
		formaDataObj.append("category", formData.category);
		if (formData.image) {
			formaDataObj.append("file", formData.image);
			// here is what the multer middleware looks like:
			// const uploadFile = multer({ storage }).single("file");
		}

		try {
			const token = Cookies.get("token");

			const { data } = await axios.post(
				`${author_service_base_url}/api/v1/blog/new`,
				formaDataObj,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			// response from backend is:
			// res.json({
			// 	message: "Blog Created",
			// 	blog: result[0],
			// });

			toast.success(data.message);
			setFormData({
				title: "",
				description: "",
				category: "",
				image: null,
				blogcontent: "",
			});

			setIsLoading(false);
		} catch (error) {
			toast.error("❌ Error in AddBlog: ", error);
			setIsLoading(false);
		}
	};

	return (
		<div className="py-6 px-[5vw] md:px-[8vw] lg:px-[12vw]">
			<Card>
				<CardHeader>
					<h2 className="text-2xl font-bold">Add New Blog</h2>
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
								onChange={(e) => {
									setFormData((prev) => {
										return {
											...prev,
											[e.target.name]: e.target.value,
										};
									});
								}}
								placeholder="Enter Blog title"
								// className={
								// 	aiTitle
								// 		? "animate-pulse placeholder:opacity-60"
								// 		: ""
								// }
								required
							/>

							<Button
								type="button"
								// onClick={aiTitleResponse}
								// disabled={aiTitle}
							>
								<HiMiniArrowPathRoundedSquare className="w-4 h-4" />
								{/* <RefreshCw
									className={aiTitle ? "animate-spin" : ""}
								/> */}
							</Button>
						</div>

						{/* DESCRIPTION */}
						<Label>Description</Label>
						<div className="flex justify-center items-center gap-2">
							<Input
								name="description"
								value={formData.description}
								placeholder="Enter Blog descripiton"
								onChange={(e) => {
									setFormData((prev) => {
										return {
											...prev,
											[e.target.name]: e.target.value,
										};
									});
								}}
								// className={
								// 	aiDescripiton
								// 		? "animate-pulse placeholder:opacity-60"
								// 		: ""
								// }
								required
							/>

							<Button
								type="button"
								// onClick={aiTitleResponse}
								// disabled={aiTitle}
							>
								<HiMiniArrowPathRoundedSquare className="w-4 h-4" />
								{/* <RefreshCw
									className={aiTitle ? "animate-spin" : ""}
								/> */}
							</Button>
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
									placeholder={"Select category"}
								></SelectValue>
							</SelectTrigger>

							<SelectContent>
								{blogCategories.map((item, idx) => {
									return (
										<SelectItem key={idx} value={item}>
											{item}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>

						{/* IMAGE UPLOAD */}
						<div>
							<Label>Upload Image</Label>
							<br />
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
									Paste you blog or type here. You can use
									rich text formatting. Please add image after
									improving your grammer
								</p>

								<Button type="button" size={"sm"}>
									<span className="flex items-center ml-2">
										<HiMiniArrowPathRoundedSquare className="w-4 h-4" />
										<span className="ml-2">
											Fix Grammer
										</span>
									</span>
								</Button>
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

							{/* Jodit Editor er kaj pore korbo */}
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

export default AddBlog;
