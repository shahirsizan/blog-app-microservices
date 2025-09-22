"use client";

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";

export const user_service_base_url = "http://localhost:5000";
export const author_service_base_url = "http://localhost:5001";
export const blog_service_base_url = "http://localhost:5002";

export const blogCategories = [
	"Techonlogy",
	"Health",
	"Finance",
	"Travel",
	"Education",
	"Entertainment",
	"Study",
];

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const token = Cookies.get("token");

			const { data } = await axios.get(
				`${user_service_base_url}/api/v1/me`,
				{
					headers: {
						authorization: `Bearer ${token}`,
						"azaira-header": "bla bla bla",
					},
				}
			);

			setUser(data);
			console.log("AppCOntext -> User data: ", data);
			setIsAuthenticated(true);
			setLoading(false);
		} catch (error) {
			console.log("error -> AppContext -> fetchUser(): ", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const values = {
		user,
		setUser,
		setIsAuthenticated,
		isAuthenticated,
		setLoading,
		loading,
	};

	return (
		<AppContext.Provider value={values}>
			<GoogleOAuthProvider clientId="42238302479-0v2c6m6jq7etke9gqfp55u70m4ifgoe4.apps.googleusercontent.com">
				{children}
				<Toaster position="bottom-right" />
			</GoogleOAuthProvider>
		</AppContext.Provider>
	);
};

export const useAppData = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useappdata must be used within AppProvider");
	}
	return context;
};
