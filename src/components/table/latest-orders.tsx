import { PAGE_LIMIT, statusClass } from "@/config"
import { formatPrice, getInitials } from "@/lib"
import { GetLatestOrdersQuery } from "@/queries"
import type { LatestOrderProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowRight } from "iconsax-react"
import { MoreHorizontal } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { DataTable } from "../shared"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type Props = {
	timeLine: string
}

const columns: ColumnDef<LatestOrderProps>[] = [
	{
		header: "Product",
		accessorKey: "product_name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar className="size-9">
					<AvatarImage src={row.original.images?.[0]} alt={row.getValue("product_name")} />
					<AvatarFallback>{getInitials(row.getValue("product_name"))}</AvatarFallback>
				</Avatar>
				<p className="capitalize">{row.getValue("product_name")}</p>
			</div>
		),
	},
	{
		header: () => <p className="text-center">QTY</p>,
		accessorKey: "quantity",
		cell: ({ row }) => <p className="text-center">x{row.getValue("quantity")}</p>,
	},
	{
		header: "Date",
		accessorKey: "createdAt",
		cell: ({ row }) => <p>{format(row.getValue("createdAt"), "MMM dd, yyyy")}</p>,
	},
	{
		header: "Unit price",
		accessorKey: "unit_price",
		cell: ({ row }) => formatPrice(row.getValue("unit_price")),
	},
	{
		header: "Total price",
		accessorKey: "total_price",
		cell: ({ row }) => formatPrice(row.getValue("total_price")),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<p className={`capitalize ${statusClass[row.getValue("status") as keyof typeof statusClass]}`}>
				{row.getValue("status")}
			</p>
		),
	},
	{
		header: "Action",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>

				<PopoverContent>
					<Link
						to={`/dashboard/orders/${row.original.order}`}
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

export const LatestOrdersTable = ({ timeLine }: Props) => {
	const [searchParams] = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending } = useQuery({
		queryFn: () => GetLatestOrdersQuery({ timeLine, page, limit: PAGE_LIMIT }),
		queryKey: ["get-latest-orders", timeLine, page],
	})

	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<div className="flex flex-col gap-8 border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
			<div className="flex w-full items-center justify-between">
				<p className="text-2xl font-medium">Latest Orders</p>

				<Link to="" className="flex items-center gap-3 text-sm font-medium text-primary">
					More <ArrowRight size={16} />
				</Link>
			</div>

			<DataTable
				columns={columns}
				data={data?.data.data || []}
				totalPages={totalPages}
				isLoading={isPending}
			/>
		</div>
	)
}
