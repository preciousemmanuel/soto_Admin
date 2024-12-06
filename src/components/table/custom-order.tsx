import { PAGE_LIMIT, statusClass } from "@/config"
import { capitalize, formatPrice, getInitials, getTimeFromNow } from "@/lib"
import { GetOrdersQuery } from "@/queries"
import type { OrderProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { Link, useSearchParams } from "react-router-dom"
import { DataTable } from "../shared"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

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
			const full_name = row.original.user
				? `${row.original.user.FirstName} ${row.original.user.LastName}`
				: null

			return full_name ? (
				<div className="flex items-center gap-2">
					<Avatar className="size-9">
						<AvatarImage src="" alt={row.getValue("user")} />
						<AvatarFallback>{getInitials(full_name)}</AvatarFallback>
					</Avatar>
					<p className="capitalize">{full_name}</p>
				</div>
			) : (
				<p>N/A</p>
			)
		},
	},
	{
		header: "Created",
		accessorKey: "createdAt",
		cell: ({ row }) => getTimeFromNow(row.getValue("createdAt")),
	},
	{
		header: "Price Range",
		accessorKey: "total_amount",
		cell: ({ row }) => (
			<span>
				{formatPrice(row.original.min_price ?? 0)} - {formatPrice(row.original.max_price ?? 0)}
			</span>
		),
	},
	{
		header: "QTY",
		accessorKey: "quantity",
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<span
				className={`text-sm font-medium capitalize ${statusClass[row.getValue("status") as keyof typeof statusClass]}`}>
				{capitalize(row.getValue("status"))}
			</span>
		),
	},
	{
		header: "Actions",
		cell: ({ row }) => (
			<Link
				to={`/dashboard/orders/custom/${row.original._id}`}
				className="rounded-md border border-primary px-4 py-1 text-xs text-primary transition-colors hover:bg-primary hover:text-white">
				View
			</Link>
		),
	},
]

type Props = {
	timeLine: string
}

export const CustomOrderTable = ({ timeLine }: Props) => {
	const [searchParams] = useSearchParams()
	const status = searchParams.get("status") || "custom"
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

	return (
		<DataTable
			columns={columns}
			data={data?.data.data || []}
			totalPages={totalPages}
			isPlaceholderData={isPlaceholderData}
			isLoading={isPending}
		/>
	)
}
