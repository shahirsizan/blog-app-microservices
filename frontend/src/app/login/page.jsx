"use client";
import React, { useContext, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import { AppContext, user_service_base_url } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";

const LoginPage = () => {
	const router = useRouter();
	const { user, setUser } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(true);

	const googleResponseCallback = async (codeResponse) => {
		setIsLoading(true);

		try {
			const result = await axios.post(
				`${user_service_base_url}/api/v1/login`,
				{
					code: codeResponse["code"],
				}
			);
			// result will be:
			// res.status(200).json({
			// 	message: "Login success",
			// 	token,
			// 	user,
			// });

			Cookies.set("token", result.data.token, {
				expires: 5,
				secure: true,
				path: "/",
			});

			toast.success("Logged in!");
			setIsLoading(false);
			setUser(result.data.user);
			router.push("/");
			console.log("result.data.user: ", result.data.user);
		} catch (error) {
			console.log(
				"error -> LoginPage -> googleResponseCallback(): ",
				error
			);
			toast.error("Problem while logging in!");
			setIsLoading(false);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: googleResponseCallback,
		onError: googleResponseCallback,
		flow: "auth-code",
	});

	useEffect(() => {
		setIsLoading(false);
		if (user) {
			router.push("/");
		}
	}, [user]);

	if (isLoading) {
		return <Loading />;
	} else {
		return (
			<div className="LOGIN h-screen flex items-center justify-center">
				{" "}
				<div className="w-[80vw] md:w-[50vw] lg:w-[40vw] shadow-lg">
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="text-center text-xl lg:text-3xl">
								<span className="whitespace-nowrap">
									LOGIN WITH
								</span>
							</CardTitle>
						</CardHeader>

						<CardContent className="text-center">
							<Button
								onClick={() => {
									googleLogin();
								}}
							>
								<span className="text-lg lg:text-2xl">
									GOOGLE
								</span>{" "}
								<FcGoogle className="w-7 h-7" />
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}
};

export default LoginPage;
