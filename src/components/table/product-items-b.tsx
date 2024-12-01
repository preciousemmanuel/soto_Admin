import { formatCurrency } from "@/lib"
import type { PaginationResponse, ProductProps } from "@/types"
import { Link, useSearchParams } from "react-router-dom"
import { Pagination } from "../ui/pagination"

interface Props {
	products: PaginationResponse<ProductProps> | undefined
}

export const ProductItemsB = ({ products }: Props) => {
	const [searchParams] = useSearchParams()
	const status = searchParams.get("status")

	const totalPages = Number(products?.pagination.pageCount)

	return (
		<>
			<div className="grid grid-cols-3 gap-6">
				{products?.data.length ? (
					products.data.map((product) => (
						<Link
							to={`/dashboard/products/${product._id}`}
							className="w-full overflow-hidden rounded-lg border-0.5 border-[#f8f3f3] shadow-card shadow-primary/[8%]"
							key={product.id}>
							<div className="relative">
								<div>
									{product.product_id && typeof product.product_id !== "string" ? (
										<img
											src={product.product_id.images?.[0]}
											alt={product.product_name}
											className="h-96 w-full origin-center object-cover"
										/>
									) : (
										<img
											src={product.images?.[0]}
											alt={product.product_name}
											className="h-96 w-full origin-center object-cover"
										/>
									)}
								</div>

								{status === "sold" ? (
									<div className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
										Sold
									</div>
								) : null}

								{status === "promo" ? (
									<p className="absolute right-4 top-4 w-fit rounded bg-primary px-2 py-0.5 text-xs font-semibold text-white">
										{product.discount_price}% Promo
									</p>
								) : null}
							</div>

							<div className="flex h-full flex-col gap-1 bg-[#F4F5F7] p-6">
								<h4 className="font-semibold capitalize">{product.product_name}</h4>
								<p className="text-sm text-[#898989]">{product.description}</p>
								<p className="font-semibold text-primary">{formatCurrency(product.unit_price)}</p>
							</div>
						</Link>
					))
				) : (
					<p className="col-span-full text-center text-sm text-neutral-500">
						No {searchParams.get("status")} products
					</p>
				)}
			</div>

			<Pagination totalPages={totalPages} />
		</>
	)
}
