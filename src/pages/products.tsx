import { useQuery } from "@tanstack/react-query"
import { SearchNormal1 } from "iconsax-react"
import { Link } from "react-router-dom"
import React from "react"

import { ProductItem } from "@/components/table"
import { Button } from "@/components/ui/button"
import { GetProductsQuery } from "@/queries"
import { productStatus } from "@/config"
import { TimelineProps } from "@/types"
import { useDebounce } from "@/hooks"

const LIMIT = 10
const tabs = ["ACTIVE", "SOLD", "PROMO", "OUT_OF_STOCK", "RETURNED"] as const
type Tabs = (typeof tabs)[number]

const Products = () => {
	const [status, setStatus] = React.useState<Tabs>("ACTIVE")
	const [timeLine] = React.useState<TimelineProps>("")
	const [query, setQuery] = React.useState("")
	const [page] = React.useState(1)

	const product_name = useDebounce(query, 500)

	const { data: products } = useQuery({
		queryFn: () =>
			GetProductsQuery({ timeLine, page, limit: LIMIT, select_type: status, product_name }),
		queryKey: ["get-products", timeLine, page, status, product_name],
	})

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Products Management</p>
				<div className="flex items-center gap-6">
					<Button variant="outline">Add Interest</Button>
					<Link to="/dashboard/products/create">
						<Button> Add Product</Button>
					</Link>
				</div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14">
				<div className="flex h-12 w-[329px] items-center gap-2 rounded-md border p-3">
					<SearchNormal1 className="size-5" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="h-full w-full bg-transparent outline-none"
						placeholder="Search by product name"
					/>
				</div>
				<div className="flex w-full flex-col">
					<div className="flex w-full items-center gap-[30px] border-b">
						{tabs.map((tab) => (
							<button
								key={tab}
								className={`relative py-2 capitalize transition-all before:absolute before:-bottom-0.5 before:left-0 before:h-0.5 before:bg-primary ${
									tab === status ? "before:w-full" : "before:w-0"
								}`}
								onClick={() => setStatus(tab)}>
								<p className="text-[16px] font-medium">{productStatus[tab]}</p>
							</button>
						))}
					</div>
					<div className="grid w-full grid-cols-3 gap-[30px] pt-5">
						{products?.data.data.map((product, index) => <ProductItem key={index} product={product} />)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Products
