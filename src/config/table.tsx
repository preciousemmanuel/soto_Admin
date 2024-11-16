import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"
import { format } from "date-fns"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { TransactionProps } from "@/types"
import { formatCurrency } from "@/lib"

export const transactionColumm: ColumnDef<TransactionProps>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "tracking_id",
		header: "Tracking ID",
		cell: ({ row }) => <span>{row.original.tracking_id}</span>,
	},
	{
		accessorKey: "user",
		header: "Name",
		cell: ({ row }) => {
			return (
				<span className="flex flex-col">
					<span className="text-sm font-medium capitalize">
						{row.original.user.FirstName} {row.original.user.LastName}
					</span>
					<span className="capitalize">{row.original.user.Role}</span>
				</span>
			)
		},
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => (
			<span className={`text-sm font-medium`}>{formatCurrency(row.original.amount)}</span>
		),
	},
	{
		accessorKey: "payment_type",
		header: "Method",
		cell: ({ row }) => (
			<span className="flex flex-col">
				<span className="text-sm font-medium">{row.original.payment_type}</span>
				<span></span>
			</span>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => {
			return (
				<span className="flex flex-col">
					<span className="text-sm font-medium">{format(row.original.createdAt, "dd MMM, yyyy")}</span>
					<span></span>
				</span>
			)
		},
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			return (
				<span className="flex flex-col">
					<span className="text-sm font-medium">{row.original.status}</span>
					<span></span>
				</span>
			)
		},
	},
	{
		accessorKey: "actions",
		cell: ({ row }) => {
			return (
				<Popover>
					<PopoverTrigger asChild>
						<MoreHorizontal />
					</PopoverTrigger>
					<PopoverContent className="flex w-[200px] flex-col gap-4">
						<Link to={`/dashboard/wallet/${row.original.id}`} className="text-sm">
							Review Order
						</Link>
						<Separator className="" />
					</PopoverContent>
				</Popover>
			)
		},
	},
]
