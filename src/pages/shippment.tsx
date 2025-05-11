import { DataTable, Spinner } from "@/components/shared"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import { frequencyFilter, PAGE_LIMIT, statusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { capitalize, formatPrice } from "@/lib"
import { GetShipmentQuery } from "@/queries"
import type { ShipmentProps, TimelineProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { Link, useSearchParams } from "react-router-dom"


const columns: ColumnDef<ShipmentProps>[] = [
	{
		header: "Shipment ID",
		accessorKey: "created_shipment_id",
		cell: ({ row }) => <p>#{row.original.created_shipment_id}</p>,
	},
	{
		header: "Order ID",
		accessorKey: "order._id",
		cell: ({ row }) => (
			<p>#{row.original.order?._id?.substring(0, 8) ?? "N/A"}</p>
		),
	},
	{
		header: "Price",
		accessorKey: "price",
		cell: ({ row }) => formatPrice(row.original.price),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<span
				className={`text-sm font-medium capitalize ${statusClass[row.original.status as keyof typeof statusClass]}`}>
				{capitalize(row.original.status)}
			</span>
		),
	},
	{
		header: "Tracking ID",
		accessorKey: "tracking_id",
		cell: ({ row }) => (
			<span className="text-xs capitalize">{capitalize(row.original.order.tracking_id)}</span>
		),
	},
	{
		header: "Delivery Agent",
		accessorKey: "delivery_agent_name",
		cell: ({ row }) => (
			<div>
				<p>{row.original.delivery_agent_name || "N/A"}</p>
				<p className="text-xs text-muted-foreground">{row.original.delivery_agent_contact || ""}</p>
			</div>
		),
	},
	{
		header: "Actions",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>
				<PopoverContent>
					<Link
						to={`/dashboard/orders/${row.original?.order?._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View order
					</Link>
				</PopoverContent>
			</Popover>
		),
	},
]

const Shippment = () => {
	usePageTitle("Shippment")
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("ALL")
	const [searchParams, setSearchParams] = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () =>
			GetShipmentQuery({
				timeLine,
				page,
				limit: PAGE_LIMIT
			}),
		queryKey: ["get-shipment", timeLine, page],
		placeholderData: keepPreviousData,
	})

	const totalPages = Number(data?.data.pagination.pageCount)
	// const total = Number(data?.data.pagination.totalCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Shippment Management</h2>

				<div className="flex items-center gap-6">
					<Select value={timeLine} onValueChange={setTimeLine}>
						<SelectTrigger className="w-[166px]">
							<SelectValue placeholder="Select Range" />
						</SelectTrigger>
						<SelectContent>
							{frequencyFilter.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</header>

			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<DataTable
					columns={columns}
					data={data?.data.data as ShipmentProps[] || []}
					totalPages={totalPages}
					isPlaceholderData={isPlaceholderData}
				/>
			)}
		</section>
	)
}

export default Shippment
