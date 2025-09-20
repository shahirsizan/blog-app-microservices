"use client";
import { Button } from "@/components/ui/button";
import { IoCloseOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiLogin } from "react-icons/ci";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="NAVBAR sticky top-0 bg-white shadow-sm py-3 z-50 px-[5vw] md:px-[8vw] lg:px-[12vw]">
			<div className=" flex justify-between items-center">
				<Link
					href={"/blogs"}
					className="LOGO text-xl font-bold text-gray-900"
				>
					The Reading Retreat
				</Link>

				<div className="MOBILEMENUBUTTON md:hidden">
					<Button
						variant={"ghost"}
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? (
							<IoCloseOutline className="w-6 h-6" />
						) : (
							<GiHamburgerMenu className="w-6 h-6" />
						)}
					</Button>
				</div>

				<ul className="NAVLINKS hidden md:flex justify-center items-center space-x-6 text-gray-700">
					<li>
						<Link href={"/blogs"} className="hover:text-blue-500">
							Home
						</Link>
					</li>

					<li>
						<Link
							href={"/blog/saved"}
							className="hover:text-blue-500"
						>
							Saved Blogs
						</Link>
					</li>

					<Link href={"/login"} className="hover:text-blue-500">
						<CiLogin className="w-6 h-6" />
					</Link>
				</ul>
			</div>

			{/* HIDDEN MOBILE MENU BAR */}
			<div
				className={`MOBILEMENUBAR md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<ul className="flex flex-col justify-center items-center space-y-4 p-4 text-gray-700 bg-white shadow-md">
					<li>
						<Link href={"/blogs"} className="hover:text-blue-500">
							Home
						</Link>
					</li>

					<li>
						<Link
							href={"/blog/saved"}
							className="hover:text-blue-500"
						>
							Saved Blogs
						</Link>
					</li>

					<Link href={"/login"} className="hover:text-blue-500">
						<CiLogin className="w-6 h-6" />
					</Link>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
