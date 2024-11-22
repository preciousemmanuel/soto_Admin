import { Spinner } from "@/components/shared"
import { ProductItem } from "@/components/table"
import { ProductItemsB } from "@/components/table/product-items-b"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PAGE_LIMIT } from "@/config"
import { useDebounce, usePageTitle } from "@/hooks"
import { replaceSpaceWithUnderscore } from "@/lib"
import { GetProductsQuery } from "@/queries"
import type { TimelineProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { SearchNormal1 } from "iconsax-react"
import * as React from "react"
import { useSearchParams } from "react-router-dom"

const tabs = ["active", "sold", "promo", "out of stock", "returned"] as const
type Tabs = (typeof tabs)[number]

const Products = () => {
	usePageTitle("Products")
	const [searchParams, setSearchParams] = useSearchParams()

	const status = replaceSpaceWithUnderscore(searchParams.get("status") || "active")
	const page = Number(searchParams.get("page") || 1)

	// const [status, setStatus] = React.useState<Tabs>("ACTIVE")
	const [timeLine] = React.useState<TimelineProps>("")
	const [query, setQuery] = React.useState("")

	const product_name = useDebounce(query, 500)

	const { data: products, isPending } = useQuery({
		queryFn: () =>
			GetProductsQuery({
				timeLine,
				page,
				limit: PAGE_LIMIT,
				select_type: status.toUpperCase(),
				product_name,
			}),
		queryKey: ["get-products", timeLine, page, status, product_name],
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="text-3xl font-medium">Products Management</h2>

				<div className="flex items-center gap-6">
					<div className="flex items-center gap-3">
						<Button variant="outline" className="border-primary hover:bg-primary/5">
							Add interest
						</Button>
						<Button>Add Product</Button>
					</div>
				</div>
			</header>

			<div className="relative flex items-center gap-2">
				<SearchNormal1 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5F6B7A]" />
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-96 rounded-md border bg-neutral-50 p-3 pl-12 outline-none focus:ring-1 focus-visible:ring-primary"
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
							{tab} Products
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
						<TabsContent value="active">
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
