"use client";

import React, { useContext } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import { MdCheckBox } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { AppContext } from "@/context/AppContext";
import { Button } from "./ui/button";

const SideBar = () => {
	const {
		fetchBlogs,
		blogCategories,
		category,
		setCategory,
		searchQuery,
		setSearchQuery,
	} = useContext(AppContext);

	return (
		<Sidebar className="mt-[52px]">
			<SidebarContent className="bg-white ">
				<SidebarGroup>
					{/* SEARCH QUERY */}
					<SidebarGroupLabel>Search</SidebarGroupLabel>
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
						}}
						placeholder="Search blog"
					/>

					{/* CATEGORY*/}
					<SidebarGroupLabel>Categories</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							{/* CATEGORIES */}
							{blogCategories?.map((cat: string, idx: number) => {
								return (
									<SidebarMenuButton
										key={idx}
										onClick={() => {
											setCategory(cat);
										}}
									>
										{cat === category ? (
											<MdCheckBox />
										) : (
											<MdCheckBoxOutlineBlank />
										)}{" "}
										<span>{cat}</span>
									</SidebarMenuButton>
								);
							})}
						</SidebarMenuItem>
					</SidebarMenu>

					<Button
						onClick={() => {
							fetchBlogs();
						}}
					>
						Search
					</Button>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default SideBar;
