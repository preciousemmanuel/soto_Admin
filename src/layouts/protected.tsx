import { Navigate, Outlet } from "react-router-dom"

interface Props {
	isAuthenticated: boolean
	redirectURL?: string
}

export function ProtectedRoutes({ isAuthenticated, redirectURL = "/" }: Props) {
	if (!isAuthenticated) {
		return <Navigate to={redirectURL} />
	}

	return <Outlet />
}
