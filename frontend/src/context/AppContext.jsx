"use client";

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";
import { redirect } from "next/dist/server/api-utils";

export const user_service_base_url = "http://localhost:5000";
export const author_service_base_url = "http://localhost:5001";
export const blog_service_base_url = "http://localhost:5002";

// 🧩🧩🧩🧩🧩 Use useContext for Accessing Data
// You should use useContext to directly access and use the state and functions provided by your context. The component will automatically re-render whenever the context value changes. This is the correct and most efficient way to get data from context.
// const MyComponent = () => {
// 			const { user, isAuthenticated, isLoading } = useContext(AppContext);
// 			The component re-renders automatically when any of these values change
// 			No need for useEffect here.
// 			... component logic using user, isAuthenticated, isLoading
// };

// Use useEffect for Side Effects Triggered by Context Changes
// You only need useEffect when a side effect must occur in response to a change in the context data. This means you need to do something after the context data is updated, not just render it.
// const MyOtherComponent = () => {
//   		const { isAuthenticated, user } = useContext(AppContext);
//   		const router = useRouter();

//   		// Use useEffect to handle a side effect (redirection)
//   		useEffect(() => {
//   		  if (!isAuthenticated && !user) {
//   		    router.push('/login');
//   		  }
//   		}, [isAuthenticated, user, router]); // Dependency array to run the effect when these values change

//   		// The rest of the component renders based on the current state.
//   		// The redirection is a side effect.
// };

// Common scenarios for using useEffect with context:
//     Redirection: If you need to navigate to a new page when a value in the context changes.
//     API Calls: If a change in the context (e.g., a new userId) requires you to fetch additional data from an API.
//     Local Storage Sync: If you want to save context data to local storage whenever it changes.
// In summary, your components should directly consume context values, and you should only reach for useEffect when you need to perform an action or trigger an effect because a context value has changed.

const blogCategories = [
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
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const token = Cookies.get("token");

			if (!token) {
				setIsAuthenticated(false);
				setIsLoading(false);
				return;
			}

			const { data } = await axios.get(
				`${user_service_base_url}/api/v1/me`,
				{
					headers: {
						authorization: `Bearer ${token}`,
						"azaira-header": "bla bla bla",
					},
				}
			);

			console.log("Context -> User data: ", data);

			setUser(data);
			setIsAuthenticated(true);
			setIsLoading(false);
		} catch (error) {
			console.log("error -> Context -> fetchUser(): ", error);
			setIsLoading(false);
		}
	};

	const logoutUser = async () => {
		Cookies.remove("token");
		setUser(null);
		setIsAuthenticated(false);
		redirect("/");
		toast.success("✅ Logged Out");
	};

	useEffect(() => {
		fetchUser();
	}, []);

	// IF AT ANY POINT, THE BROWSER TOKEN GETS DELETED BY ANY MEANS,
	// WE'LL CHANGE THE FOLLOWING STATES
	useEffect(() => {
		if (!Cookies.get("token")) {
			setIsAuthenticated(false);
			setUser(null);
		}
	});

	const values = {
		blogCategories,
		fetchUser,
		logoutUser,
		user,
		setUser,
		isAuthenticated,
		setIsAuthenticated,
		isLoading,
		setIsLoading,
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
