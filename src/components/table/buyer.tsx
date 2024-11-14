// import { useMutation } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { TableCell, TableRow } from "../ui/table"
import { BuyerProps } from "@/types"

interface Props {
	buyer: BuyerProps
	isSelected?: boolean
}

export const BuyerItem = ({ buyer }: Props) => {
	return (
		<TableRow key={buyer.id}>
			<TableCell className="">Products</TableCell>
			<TableCell className="">Buyers</TableCell>
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
