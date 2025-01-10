import { AddInterestModal } from "@/components/modals/add-interest"
import { Spinner } from "@/components/shared"
import { ProductItem } from "@/components/table"
import { ProductItemsB } from "@/components/table/product-items-b"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { frequencyFilter, PAGE_LIMIT } from "@/config"
import { useDebounce, usePageTitle } from "@/hooks"
import { getInitials, replaceSpaceWithUnderscore } from "@/lib"
import { GetProductsQuery } from "@/queries"
import { GetSettingsQuery } from "@/queries/settings"
import { GetCategoriesQuery } from "@/queries/shared"
import type { TimelineProps } from "@/types"
import { usePrefetchQuery, useQuery } from "@tanstack/react-query"
import { SearchNormal1 } from "iconsax-react"
import * as React from "react"
import { useSearchParams } from "react-router-dom"

const tabs = [
	"approved",
	"pending",
	"declined",
	"sold",
	"promo",
	"out of stock",
	"returned",
] as const
type Tabs = (typeof tabs)[number]

const Products = () => {
	usePageTitle("Products")
	const [searchParams, setSearchParams] = useSearchParams()

	const status = replaceSpaceWithUnderscore(searchParams.get("status") || "approved")
	const page = Number(searchParams.get("page") || 1)

	// const [status, setStatus] = React.useState<Tabs>("ACTIVE")
	const [category, setCategory] = React.useState<string>("")
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("")
	const [query, setQuery] = React.useState("")

	const product_name = useDebounce(query, 500)

	const { data: categories } = useQuery({
		queryKey: ["get-categories", 1],
		queryFn: () =>
			GetCategoriesQuery({
				page: 1,
				limit: 30,
			}),
	})
	const { data: products, isPending } = useQuery({
		queryFn: () =>
			GetProductsQuery({
				timeLine,
				page,
				limit: PAGE_LIMIT,
				select_type: status.toUpperCase(),
				product_name,
				...(category && category !== "all" && { category }),
			}),
		queryKey: ["get-products", timeLine, page, status, product_name, category],
	})

	// fetch
	usePrefetchQuery({
		queryFn: GetSettingsQuery,
		queryKey: ["get-settings"],
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="text-3xl font-medium">Products Management</h2>

				<div className="flex items-center gap-3">
					<Select value={category} onValueChange={setCategory}>
						<SelectTrigger className="w-52 capitalize">
							<SelectValue placeholder="Select Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all" className="capitalize">
								<div className="flex flex-row items-center gap-2">
									<Avatar className="size-6">
										<AvatarImage src="" alt="" />
										<AvatarFallback>{getInitials("ALL")}</AvatarFallback>
									</Avatar>

									<span>All Categories</span>
								</div>
							</SelectItem>

							{categories?.data.data.map((category) => (
								<SelectItem key={category._id} value={category._id} className="capitalize">
									<div className="flex flex-row items-center gap-2">
										<Avatar className="size-6">
											<AvatarImage src={category.image} alt="" />
											<AvatarFallback>{getInitials(category.name)}</AvatarFallback>
										</Avatar>

										<span>{category.name}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={timeLine} onValueChange={setTimeLine}>
						<SelectTrigger className="w-[166px]">
							<SelectValue placeholder="Select Range" />
						</SelectTrigger>
						<SelectContent>
							{frequencyFilter.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<AddInterestModal />
				</div>
			</header>

			<div className="relative flex items-center gap-2">
				<SearchNormal1 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5F6B7A]" />
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-96 rounded-md border-0 bg-neutral-50 px-3 py-2 pl-12 outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus-visible:ring-primary"
					placeholder="Search by product name"
				/>
			</div>

			<Tabs
				defaultValue={status ?? tabs[0]}
				value={status ?? tabs[0]}
				onValueChange={(value) => {
					searchParams.set("status", replaceSpaceWithUnderscore(value))
					setSearchParams(searchParams)
				}}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger key={tab} value={replaceSpaceWithUnderscore(tab)}>
							{tab === "approved" ? "Active" : tab}
						</TabsTrigger>
					))}
				</TabsList>

				{isPending ? (
					<div className="flex items-center justify-center">
						<Spinner variant="primary" size="lg" />
					</div>
				) : (
					<>
						{/* ACTIVE PRODUCTS */}
						{/* <TabsContent value="active">
							<ProductItem products={products?.data} />
						</TabsContent> */}

						<TabsContent value="approved">
							<ProductItem products={products?.data} />
						</TabsContent>

						<TabsContent value="pending">
							<ProductItem products={products?.data} />
						</TabsContent>

						<TabsContent value="declined">
							<ProductItem products={products?.data} />
						</TabsContent>

						{/* SOLD PRODUCTS */}
						<TabsContent value="sold">
							<ProductItemsB products={products?.data} />
						</TabsContent>

						{/* PROMO PRODUCTS */}
						<TabsContent value="promo">
							<ProductItemsB products={products?.data} />
						</TabsContent>

						{/* OUT OF STOCK PRODUCTS */}
						<TabsContent value="out_of_stock">
							<ProductItem products={products?.data} />
						</TabsContent>

						{/* RETURNED PRODUCTS */}
						<TabsContent value="returned">
							<ProductItemsB products={products?.data} />
						</TabsContent>
					</>
				)}
			</Tabs>
		</section>
	)
}

export default Products
