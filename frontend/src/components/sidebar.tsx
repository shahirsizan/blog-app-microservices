"use client";

import React, { useContext, useState } from "react";
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
		setCategory,
		searchQuery,
		setSearchQuery,
	} = useContext(AppContext);

	const [selectedOption, setSelectedOption] = useState("");

	return (
		<Sidebar className="mt-[52px]">
			<SidebarContent className="bg-white ">
				<SidebarGroup>
					{/* SEARCH QUERY. TRIGGERS UPON CLICKING BUTTON */}
					<SidebarGroupLabel>Search</SidebarGroupLabel>
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
						}}
						placeholder="Search blog"
					/>

					{/* CATEGORY. TRIGGERS UPON BEING SELECTED AN OPTION */}
					<SidebarGroupLabel>Categories</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							{/* CATEGORIES */}
							{blogCategories?.map(
								(category: string, idx: number) => {
									return (
										<SidebarMenuButton
											key={idx}
											onClick={() => {
												setSelectedOption(category);
												setCategory(category);
											}}
										>
											{selectedOption === category ? (
												<MdCheckBox />
											) : (
												<MdCheckBoxOutlineBlank />
											)}{" "}
											<span>{category}</span>
										</SidebarMenuButton>
									);
								}
							)}
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
