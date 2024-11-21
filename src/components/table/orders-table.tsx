import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PAGE_LIMIT, statusClass } from "@/config"
import { capitalize, formatPrice, getInitials, getTimeFromNow } from "@/lib"
import { GetOrdersQuery } from "@/queries"
import { OrderProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { Spinner } from "../shared"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Pagination } from "../ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface Props {
	timeLine: string
}

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

const defaultData: never[] = []
export const OrdersTable = ({ timeLine }: Props) => {
	const [searchParams] = useSearchParams()
	const status = searchParams.get("status") || "pending"
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending } = useQuery({
		queryFn: () =>
			GetOrdersQuery({
				timeLine,
				page,
				limit: PAGE_LIMIT,
				status: status.toUpperCase(),
			}),
		queryKey: ["get-orders", timeLine, page, status],
	})
	const table = useReactTable({
		data: data?.data.data || defaultData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const totalPages = Number(data?.data.pagination.pageCount)
	// const totalCount = Number(data?.data.pagination.totalCount)
	// const { isPending, mutateAsync } = useMutation({
	// 	mutationFn: (id: string) => CancelOrderMutation(id),
	// 	mutationKey: ["cancel-order"],
	// 	onSuccess: (data) => {
	// 		console.log(data)
	// 		setOpen(false)
	// 	},
	// 	onError: (error) => {
	// 		console.error(error)
	// 	},
	// })

	return (
		<>
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
									<span>No {searchParams.get("status")} order(s).</span>
								)}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Pagination totalPages={totalPages} />
		</>
	)
}
