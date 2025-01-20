import { Suspense } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

import SotoLogoWhite from "@/assets/icons/SotoLogoWhite"
import { Loading } from "@/components/shared"
import { dashboard_links } from "@/config"

export function DashboardLayout() {
	const { pathname } = useLocation()

	const isActiveLink = (href: string) => {
		// Exact match for root dashboard
		if (href === "/dashboard" && pathname === "/dashboard") {
			return true
		}
		// For other routes, check if it's the current path or a child route
		if (href !== "/dashboard") {
			return pathname.startsWith(href)
		}
		return false
	}

	return (
		<div className="flex h-screen overflow-hidden">
			<aside className="flex h-full w-[260px] flex-col bg-primary">
				<div className="grid w-full place-items-center border-b-[0.5px] border-[#f8f3f3] py-8">
					<SotoLogoWhite />
				</div>
				<div className="flex w-full flex-col gap-4 overflow-y-auto px-[26px] py-5">
					{dashboard_links.map(({ href, icon: Icon, label }, index) => (
						<Link
							key={index}
							to={href}
							className={`flex items-center gap-4 rounded px-4 py-2 text-sm font-medium text-white ${isActiveLink(href) ? "bg-[#fb9984]" : ""}`}>
							<Icon /> {label}
						</Link>
					))}
				</div>
			</aside>

			<main className="flex-1 overflow-y-auto p-10">
				<Suspense fallback={<Loading />}>
					<Outlet />
				</Suspense>
			</main>
		</div>
	)
}
