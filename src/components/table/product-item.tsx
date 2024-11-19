import { MoreHorizontal } from "lucide-react"

import { formatCurrency } from "@/lib"
import { ProductProps } from "@/types"
import { useSearchParams } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"

interface Props {
	products: ProductProps[]
	isSelected?: boolean
}

export const ProductItem = ({ products }: Props) => {
	const [searchParams] = useSearchParams()

	return (
		<>
			{products.length ? (
				products.map((product) => (
					<div className="w-full rounded-lg border-0.5 border-[#F0F0F0] bg-[#FCFCFC] p-2 shadow-card shadow-primary/[8%]">
						<div className="flex h-full w-full flex-col justify-between gap-6">
							<div className="flex w-full gap-3">
								<div className="rounded-lg border border-[#F5F5FA] bg-white">
									<img
										src={product.images?.[0]}
										alt={product.product_name}
										className="aspect-[1.06/1] w-28 rounded-md object-cover"
									/>
								</div>

								<div className="flex h-full flex-col gap-1 self-end">
									<p className="text-sm font-semibold capitalize">{product.product_name}</p>
									<p className="text-xs"></p>
									<p className={`text-sm ${!product.in_stock ? "text-[#999999]" : "text-primary"}`}>
										{formatCurrency(product.unit_price)}
									</p>
								</div>

								<Popover>
									<PopoverTrigger asChild>
										<button className="ml-auto grid place-items-center self-start rounded bg-neutral-100 px-2 pt-0.5">
											<MoreHorizontal size={20} />
										</button>
									</PopoverTrigger>

									<PopoverContent className="w-[200px]"></PopoverContent>
								</Popover>
							</div>

							<div className="flex w-full flex-col gap-4">
								<div className="flex w-full flex-col gap-2">
									<p className="text-sm font-semibold">Summary</p>
									<p className="text-xs first-letter:capitalize">{product.description}</p>
								</div>
								<div className="flex w-full flex-col rounded bg-[#f5f5fa] p-2">
									<div className="flex w-full items-center justify-between">
										<p className="text-xs">Sold</p>
										<div className="flex items-center gap-8">
											<p className="text-xs">{product.total_quantity_sold}</p>
										</div>
									</div>
									<Separator className="my-2" />
									<div className="flex w-full items-center justify-between">
										<p className="text-xs">Quantity</p>
										<div className="flex items-center gap-8">
											<p className="text-xs">{product.product_quantity}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))
			) : (
				<p className="col-span-full text-center text-sm text-neutral-500">
					No {searchParams.get("status")} products
				</p>
			)}
		</>
	)
}
