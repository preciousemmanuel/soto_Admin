import Cookies from "js-cookie"
import React from "react"

import { AuthContext } from "./auth-context"
import { UserProps } from "@/types"

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = React.useState(false)

	const signin = (user: UserProps, token: string) => {
		localStorage.setItem("SOTO_ADMIN", JSON.stringify(user))
		Cookies.set("SOTO_ADMIN_TOKEN", token, {
			sameSite: "None",
			secure: true,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days,
		})
		setIsAuthenticated(true)
	}

	const signout = () => {
		localStorage.removeItem("SOTO_ADMIN")
		Cookies.remove("SOTO_ADMIN_TOKEN")
		window.location.replace("/signin")
		setIsAuthenticated(false)
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated, signin, signout }}>
			{children}
		</AuthContext.Provider>
	)
}
