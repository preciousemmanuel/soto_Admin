import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { Suspense } from "react"

import { DashboardLayout, ProtectedRoutes } from "@/layouts"
import { ErrorBoundary } from "./components/shared"
import { useUserStore } from "./store/z-store"
import {
	Buyer,
	Buyers,
	Coupon,
	CreateProduct,
	Feedback,
	ForgotPassword,
	Order,
	Orders,
	Overview,
	Product,
	Products,
	Purchaser,
	Seller,
	Sellers,
	Settings,
	Signin,
	Transfer,
	Wallet,
	Withdrawal,
} from "@/pages"

function App() {
	const { isAuthenticated } = useUserStore()

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Signin />,
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
									path: "withdrawal",
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
							path: "purchaser",
							children: [
								{
									index: true,
									element: <Purchaser />,
								},
							],
						},
						{
							path: "coupon-and-promo",
							element: <Coupon />,
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
