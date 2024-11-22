import { PAGE_LIMIT } from "@/config"
import { formatCurrency, getInitials } from "@/lib"
import { GetBuyersQuery } from "@/queries"
import type { BuyersProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { Spinner } from "../shared"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Pagination } from "../ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type Props = {
	search: string
}

const columns: ColumnDef<BuyersProps>[] = [
	{
		header: "Buyer",
		accessorKey: "first_name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2.5">
				<Avatar className="size-9">
					<AvatarImage src="" alt={row.getValue("first_name")} />
					<AvatarFallback>{getInitials(row.getValue("first_name"))}</AvatarFallback>
				</Avatar>

				<div>
					<p className="font-medium capitalize leading-none">
						{row.original.first_name} {row.original.last_name}
					</p>
					<span className="text-xs text-gray-400">{row.original.email}</span>
				</div>
			</div>
		),
	},
	{
		header: "Total Spent",
		accessorKey: "total_spent",
		cell: ({ row }) => (
			<span className="text-center">{formatCurrency(row.getValue("total_spent"))}</span>
		),
	},
	{
		header: "Last Order Amount",
		accessorKey: "last_order_price",
		cell: ({ row }) => (
			<span className="text-center">{formatCurrency(row.getValue("last_order_price"))}</span>
		),
	},
	{
		header: "Joined Date",
		accessorKey: "createdAt",
		cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
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
						to={`/dashboard/buyers/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View Buyer
					</Link>

					{/* <button
						type="button"
						className="flex w-full rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						Approve seller
					</button>

					<button
						type="button"
						className="flex w-full rounded-md px-4 py-2 text-xs text-red-600 transition-all hover:bg-red-600 hover:text-white">
						Remove seller
					</button> */}
				</PopoverContent>
			</Popover>
		),
	},
]

export const BuyersTable = ({ search }: Props) => {
	const [searchParams] = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending } = useQuery({
		queryFn: () => GetBuyersQuery({ page, limit: PAGE_LIMIT, search }),
		queryKey: ["get-buyers", page, search],
	})
	const table = useReactTable({
		data: data?.data.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<div className="flex flex-col gap-8 border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
			<div className="flex w-full items-center justify-between">
				<p className="text-2xl font-medium">All Sellers</p>

				{/* <Link to="" className="flex items-center gap-3 text-sm font-medium text-primary">
					More <ArrowRight size={16} />
				</Link> */}
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								{isPending ? (
									<div className="flex items-center justify-center">
										<Spinner variant="primary" size="lg" />
									</div>
								) : (
									<span>No latest order(s).</span>
								)}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{!isPending ? <Pagination totalPages={totalPages} /> : null}
		</div>
	)
}
