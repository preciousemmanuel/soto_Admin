import { MoreHorizontal } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"
import { ProductProps } from "@/types"
import { formatCurrency } from "@/lib"

interface Props {
	product: ProductProps
	isSelected?: boolean
}

export const ProductItem = ({ product }: Props) => {
	return (
		<div className="aspect-[1.17/1] w-full rounded-lg border p-2">
			<div className="relative flex h-full w-full flex-col justify-between gap-6">
				<Popover>
					<PopoverTrigger asChild>
						<button className="absolute right-0 top-0 grid size-7 place-items-center rounded bg-neutral-100">
							<MoreHorizontal size={20} />
						</button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px]"></PopoverContent>
				</Popover>
				<div className="flex w-full items-center">
					<img
						src={product.images[0]}
						alt={product.product_name}
						className="aspect-[1.06/1] w-[107px] object-cover"
					/>
					<div className="flex h-full flex-col gap-1 px-2">
						<p className="text-sm font-semibold capitalize">{product.product_name}</p>
						<p className="text-xs"></p>
						<p className="text-sm text-primary">{formatCurrency(product.unit_price)}</p>
					</div>
				</div>
				<div className="flex w-full flex-col gap-3">
					<div className="flex w-full flex-col gap-2">
						<p className="text-sm font-semibold">Summary</p>
						<p className="text-xs first-letter:capitalize">{product.description}</p>
					</div>
					<div className="flex w-full flex-col rounded bg-[#f5f5fa] p-2">
						<div className="flex w-full items-center justify-between">
							<p className="text-xs">Sold</p>
							<div className="flex items-center gap-8">
								<p className="text-xs">{product.quantity}</p>
							</div>
						</div>
						<Separator className="my-2" />
						<div className="flex w-full items-center justify-between">
							<p className="text-xs">Quantity</p>
							<div className="flex items-center gap-8">
								<p className="text-xs">{product.quantity}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
