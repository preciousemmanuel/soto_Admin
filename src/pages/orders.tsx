import { DataTable, Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { frequencyFilter, PAGE_LIMIT, statusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { capitalize, formatPrice, getInitials, getTimeFromNow } from "@/lib"
import { GetOrdersQuery } from "@/queries"
import type { TimelineProps } from "@/types"
import { OrderProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { Link, useSearchParams } from "react-router-dom"

const tabs = ["booked", "pending", "cancelled", "delivered", "failed"] as const
const columns: ColumnDef<OrderProps>[] = [
	{
		header: "Orders ID",
		accessorKey: "_id",
		cell: ({ row }) => <p>#{row.original._id.substring(0, 8)}</p>,
	},
	{
		header: "Buyer",
		accessorKey: "user",
		cell: ({ row }) => {
			const full_name = `${row.original.user.FirstName} ${row.original.user.LastName}`
			return (
				<div className="flex items-center gap-2">
					<Avatar className="size-9">
						<AvatarImage src="" alt={row.getValue("user")} />
						<AvatarFallback>{getInitials(full_name)}</AvatarFallback>
					</Avatar>
					<p className="capitalize">{full_name}</p>
				</div>
			)
		},
	},
	{
		header: "Created",
		accessorKey: "createdAt",
		cell: ({ row }) => getTimeFromNow(row.getValue("createdAt")),
	},
	{
		header: "Total",
		accessorKey: "total_amount",
		cell: ({ row }) => formatPrice(row.getValue("total_amount")),
	},
	{
		header: "Net Profit",
		accessorKey: "grand_total",
		cell: ({ row }) => formatPrice(row.getValue("grand_total")),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<span
				className={`text-sm capitalize ${statusClass[row.getValue("status") as keyof typeof statusClass]}`}>
				{capitalize(row.getValue("status"))}
			</span>
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
						to={`/dashboard/orders/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						Review order
					</Link>

					<button
						type="button"
						className="flex w-full rounded-md px-4 py-2 text-xs text-red-600 transition-all hover:bg-red-600 hover:text-white">
						Cancel order
					</button>
				</PopoverContent>
			</Popover>
		),
	},
]

const Orders = () => {
	usePageTitle("Orders")
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("ALL")
	const [searchParams, setSearchParams] = useSearchParams()

	const status = searchParams.get("status") || "booked"
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () =>
			GetOrdersQuery({
				timeLine,
				page,
				limit: PAGE_LIMIT,
				status: status.toUpperCase(),
			}),
		queryKey: ["get-orders", timeLine, page, status],
		placeholderData: keepPreviousData,
	})

	const totalPages = Number(data?.data.pagination.pageCount)
	// const total = Number(data?.data.pagination.totalCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Order Management</h2>

				<div className="flex items-center gap-6">
					<Select value={timeLine} onValueChange={setTimeLine}>
						<SelectTrigger className="w-[166px] border-0">
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
				<Tabs
					defaultValue={status}
					value={status}
					onValueChange={(value) => {
						searchParams.set("status", value)
						setSearchParams(searchParams)
					}}>
					<TabsList>
						{tabs.map((tab) => (
							<TabsTrigger key={tab} value={tab}>
								{tab}
							</TabsTrigger>
						))}
					</TabsList>

					{tabs.map((tab) => (
						<TabsContent key={tab} value={tab}>
							<DataTable
								columns={columns}
								data={data?.data.data || []}
								totalPages={totalPages}
								isPlaceholderData={isPlaceholderData}
							/>
						</TabsContent>
					))}
				</Tabs>
			)}
		</section>
	)
}

export default Orders
