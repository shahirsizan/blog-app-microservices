import SideBar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const HomeLayout = ({ children }: { children: any }) => {
	return (
		<div>
			<SidebarProvider className="w-full min-h-[calc(100vh-52px)] px-[5vw] md:px-[8vw] lg:px-[12vw]">
				<SideBar />
				<div className="w-full">{children}</div>
			</SidebarProvider>
		</div>
	);
};

export default HomeLayout;
