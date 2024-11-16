// import { useMutation } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { TableCell, TableRow } from "../ui/table"
import { SellerProps } from "@/types"

interface Props {
	seller: SellerProps
	isSelected?: boolean
}

export const SellerItem = ({ seller }: Props) => {
	return (
		<TableRow key={seller.id}>
			<TableCell className="">Products</TableCell>
			<TableCell className="">Sellers</TableCell>
			<TableCell className="">Qty</TableCell>
			<TableCell className="">Categories</TableCell>
			<TableCell className="">Revenue</TableCell>
			<TableCell className="">Net Profit</TableCell>
			<TableCell className="">Status</TableCell>
			<TableCell className="">
				<Popover>
					<PopoverTrigger>
						<MoreHorizontal />
					</PopoverTrigger>
					<PopoverContent></PopoverContent>
				</Popover>
			</TableCell>
		</TableRow>
	)
}
