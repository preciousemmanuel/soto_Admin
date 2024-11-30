import React from "react"

import { UserProps } from "@/types"

interface AuthContextProps {
	isAuthenticated: boolean
	signin: (user: UserProps, token: string) => void
	signout: () => void
}

export const AuthContext = React.createContext<AuthContextProps>({
	isAuthenticated: false,
	signin: () => {},
	signout: () => {},
})

export const useAuth = () => {
	const context = React.useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
