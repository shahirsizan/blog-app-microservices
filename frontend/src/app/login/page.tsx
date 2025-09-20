import React from "react";
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

const page = () => {
	return (
		<div className="LOGIN h-screen flex items-center justify-center">
			{" "}
			<div className="w-[70vw] lg:w-[50vw] shadow-lg">
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-center text-xl lg:text-3xl">
							<span className="whitespace-nowrap">
								LOGIN WITH
							</span>
						</CardTitle>
					</CardHeader>

					<CardContent className="text-center">
						<Button>
							<span className="text-lg lg:text-2xl">GOOGLE</span>{" "}
							<FcGoogle className="w-7 h-7" />
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default page;
