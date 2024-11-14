import { useMutation } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"
import React from "react"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog"
import { capitalize, formatPrice, getInitials, getTimeFromNow } from "@/lib"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { TableCell, TableRow } from "../ui/table"
import { CancelOrderMutation } from "@/queries"
import { Separator } from "../ui/separator"
import { statusClass } from "@/config"
import { Button } from "../ui/button"
import { OrderProps } from "@/types"
import { Spinner } from "../shared"

interface Props {
	order: OrderProps
	isSelected?: boolean
}

export const OrderItem = ({ order }: Props) => {
	const [open, setOpen] = React.useState(false)

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (id: string) => CancelOrderMutation(id),
		mutationKey: ["cancel-order"],
		onSuccess: (data) => {
			console.log(data)
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
		},
	})

	return (
		<TableRow>
			<TableCell className="">#{order._id.substring(0, 8)}</TableCell>
			<TableCell className="flex items-center gap-2 capitalize">
				<Avatar className="size-11">
					<AvatarImage src="" />
					<AvatarFallback>
						{getInitials(`${order.user.FirstName} ${order.user.LastName}`)}
					</AvatarFallback>
				</Avatar>
				{order.user.FirstName} {order.user.LastName}
			</TableCell>
			<TableCell className="">{getTimeFromNow(order.createdAt)}</TableCell>
			<TableCell className="">{formatPrice(order.total_amount)}</TableCell>
			<TableCell className="">{formatPrice(order.grand_total)}</TableCell>
			<TableCell className={`${statusClass[order.status]}`}>{capitalize(order.status)}</TableCell>
			<TableCell className="">
				<Popover>
					<PopoverTrigger>
						<MoreHorizontal />
					</PopoverTrigger>
					<PopoverContent className="flex w-[200px] flex-col gap-4">
						<Link to={`/dashboard/orders/${order._id}`} className="text-sm">
							Review Order
						</Link>
						<Separator className="" />
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<button className="w-fit text-sm text-red-600">Cancel Order</button>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Cancel Order</DialogTitle>
								<DialogDescription>Are you sure you want to cancel this order?</DialogDescription>
								<div className="grid w-full grid-cols-2 gap-6">
									<Button onClick={() => setOpen(false)} variant="outline">
										Cancel
									</Button>
									<Button onClick={() => mutateAsync(order._id)} variant="destructive">
										{isPending ? <Spinner /> : "Cancel"}
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</PopoverContent>
				</Popover>
			</TableCell>
		</TableRow>
	)
}
