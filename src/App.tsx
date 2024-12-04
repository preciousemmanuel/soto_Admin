import { Suspense } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"

import { DashboardLayout, ProtectedRoutes } from "@/layouts"
import {
	Buyer,
	Buyers,
	Coupon,
	CreateCoupon,
	CreateProduct,
	CustomOrder,
	Feedback,
	ForgotPassword,
	Order,
	Orders,
	Overview,
	Product,
	Products,
	Purchaser,
	Purchasers,
	Seller,
	Sellers,
	Settings,
	Signin,
	Transfer,
	Wallet,
	Withdrawal,
} from "@/pages"
import { ErrorBoundary } from "./components/shared"
import { useUserStore } from "./store/z-store"

function App() {
	const { isAuthenticated } = useUserStore()
	console.log("isAuthenticated", isAuthenticated)

	const router = createBrowserRouter([
		{
			path: "/",
			element: isAuthenticated ? <Navigate to="/dashboard" /> : <Signin />,
		},
		{
			path: "/forgot-password",
			element: <ForgotPassword />,
		},
		{
			path: "/dashboard",
			element: <ProtectedRoutes isAuthenticated={isAuthenticated} />,
			errorElement: <ErrorBoundary />,
			children: [
				{
					element: <DashboardLayout />,
					children: [
						{
							index: true,
							element: <Overview />,
						},
						{
							path: "wallet",
							children: [
								{
									index: true,
									element: <Wallet />,
								},
								{
									path: "transfer",
									element: <Transfer />,
								},
								{
									path: "withdrawal-requests",
									element: <Withdrawal />,
								},
							],
						},
						{
							path: "orders",
							children: [
								{
									index: true,
									element: <Orders />,
								},
								{
									path: ":id",
									element: <Order />,
								},
								{
									path: "custom/:id",
									element: <CustomOrder />,
								},
							],
						},
						{
							path: "products",
							children: [
								{
									index: true,
									element: <Products />,
								},
								{
									path: ":id",
									element: <Product />,
								},
								{
									path: "create",
									element: <CreateProduct />,
								},
							],
						},
						{
							path: "purchasers",
							children: [
								{
									index: true,
									element: <Purchasers />,
								},
								{
									path: ":id",
									element: <Purchaser />,
								},
							],
						},
						{
							path: "coupon-and-promo",
							children: [
								{
									index: true,
									element: <Coupon />,
								},
								{
									path: "create",
									element: <CreateCoupon />,
								},
							],
						},
						{
							path: "buyers",
							children: [
								{
									index: true,
									element: <Buyers />,
								},
								{
									path: ":id",
									element: <Buyer />,
								},
							],
						},
						{
							path: "sellers",
							children: [
								{
									index: true,
									element: <Sellers />,
								},
								{
									path: ":id",
									element: <Seller />,
								},
							],
						},
						{
							path: "settings-and-profile",
							element: <Settings />,
						},
						{
							path: "feedback",
							element: <Feedback />,
						},
					],
				},
			],
		},
	])

	return (
		<Suspense>
			<RouterProvider router={router} />
		</Suspense>
	)
}

export default App
