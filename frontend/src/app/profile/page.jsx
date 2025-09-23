"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppContext, user_service_base_url } from "@/context/AppContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";

const ProfilePage = () => {
	const {
		logoutUser,
		isLoading,
		setIsLoading,
		user,
		setUser,
		isAuthenticated,
	} = useContext(AppContext);
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const inputRef = useRef();
	const [formData, setFormData] = useState({
		name: user?.name || "",
		bio: user?.bio || "",
	});

	// LOGOUT HANDLER
	const logoutHandler = () => {
		logoutUser();
	};

	// AFTER SELECTING IMAGE
	const imageUploadHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("file", file);

		try {
			setIsLoading(true);
			const token = Cookies.get("token");

			const { data } = await axios.post(
				`${user_service_base_url}/api/v1/user/update/pic`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			toast.success(data.message);

			Cookies.set("token", data.token, {
				expires: 5,
				secure: true,
				path: "/",
			});

			setUser(data.user);
			setIsLoading(false);
		} catch (error) {
			toast.error("Image Update Failed");
			setIsLoading(false);
		}
	};

	// SUBMIT BIO EDIT
	const handleFormSubmit = async () => {
		try {
			setIsLoading(true);

			const token = Cookies.get("token");

			const { data } = await axios.post(
				`${user_service_base_url}/api/v1/user/update`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// response sent from backend is:
			// res.json({
			// 	message: "User bio Updated",
			// 	token,
			// 	user,
			// });
			toast.success(data.message);

			Cookies.set("token", data.token, {
				expires: 5,
				secure: true,
				path: "/",
			});
			setIsLoading(false);
			setUser(data.user);
			setIsOpen(false);
		} catch (error) {
			toast.error("❌ User update Failed!");
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	if (!isAuthenticated) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen flex justify-center items-center		px-[5vw] md:px-[8vw] lg:px-[12vw]">
			<Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-semibold">
						Profile
					</CardTitle>

					<CardContent className="flex flex-col items-center space-y-4">
						{/* IMAGE */}
						<Avatar
							id="avatar"
							className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer"
							onClick={() => {
								inputRef.current?.click();
							}}
						>
							<AvatarImage src={user?.image} />
							<input
								type="file"
								className="hidden"
								accept="image/*"
								ref={inputRef}
								onChange={(e) => {
									imageUploadHandler(e);
								}}
							/>
						</Avatar>

						{/* NAME */}
						<div className="w-full space-y-2 text-center">
							<label className="font-medium">Name</label>
							<p>{user?.name}</p>
						</div>

						{/* BIO */}
						{user?.bio && (
							<div className="w-full space-y-2 text-center">
								<label className="font-medium">Bio</label>
								<p>{user.bio}</p>
							</div>
						)}

						{/* ❌ SOCIAL MEDIA SECTION */}

						<div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
							{/* LOGOUT BUTTON */}
							<Button
								onClick={() => {
									logoutUser();
								}}
							>
								Logout
							</Button>

							{/* CREATE BLOG BUTTON */}
							<Button
								onClick={() => {
									router.push("/blog/new");
								}}
							>
								Create Blog
							</Button>

							{/* EDIT PROFILE DIALOG MODAL */}
							<Dialog
								open={isOpen}
								onOpenChange={() => {
									setIsOpen((prev) => {
										return !prev;
									});
								}}
								modal={true}
							>
								<DialogTrigger asChild>
									<Button variant={"destructive"}>
										Edit
									</Button>
								</DialogTrigger>

								<DialogContent className="sm:max-w-[40vw]">
									<DialogHeader>
										<DialogTitle>Edit Profile</DialogTitle>
									</DialogHeader>

									<div className="space-y-4 w-full">
										{/* INPUT NAME */}
										<div className="space-y-2">
											<Label>Name</Label>
											<Input
												value={formData.name}
												onChange={(e) => {
													setFormData((prev) => {
														return {
															...prev,
															name: e.target
																.value,
														};
													});
												}}
											/>
										</div>

										{/* INPUT BIO */}
										<div className="space-y-2">
											<Label>Bio</Label>
											<Input
												value={formData.bio}
												onChange={(e) => {
													setFormData((prev) => {
														return {
															...prev,
															bio: e.target.value,
														};
													});
												}}
											/>
										</div>

										{/* SAVE BUTTON */}
										<Button
											onClick={() => {
												handleFormSubmit();
											}}
											className="w-full mt-4"
										>
											Save Changes
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	);
};

export default ProfilePage;
