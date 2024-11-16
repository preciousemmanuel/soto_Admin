import { MoreHorizontal } from "lucide-react"
import { format } from "date-fns"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { capitalize, formatPrice, getInitials } from "@/lib"
import { statusClass } from "@/config"

import { TableCell, TableRow } from "../ui/table"
import { LatestOrderProps } from "@/types"

interface Props {
	order: LatestOrderProps
}

export const OverviewItem = ({ order }: Props) => {
	return (
		<TableRow>
			<TableCell className="flex items-center gap-2">
				<Avatar className="size-9">
					<AvatarImage src="" alt={order.product_name} />
					<AvatarFallback>{getInitials(order.product_name)}</AvatarFallback>
				</Avatar>
				{order.product_name}
			</TableCell>
			<TableCell>{order.quantity}</TableCell>
			<TableCell>{format(order.createdAt, "MMM dd, yyyy")}</TableCell>
			<TableCell>{formatPrice(order.total_price)}</TableCell>
			<TableCell>{order.quantity}</TableCell>
			<TableCell className={`${statusClass[order.status]}`}>{capitalize(order.status)}</TableCell>
			<TableCell>
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
