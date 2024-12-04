import { formatCurrency, getInitials } from "@/lib"
import { GetOrderQuery } from "@/queries"
import type { OrderProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useParams } from "react-router-dom"
import { Spinner } from "../shared"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type OrderItem = OrderProps["items"][number]
const columns: ColumnDef<OrderItem>[] = [
	{
		header: "Product",
		accessorKey: "product_name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar className="size-9">
					<AvatarImage src={row.original.images[0]} alt={row.getValue("product_name")} />
					<AvatarFallback>{getInitials(row.getValue("product_name"))}</AvatarFallback>
				</Avatar>
				<p className="capitalize">{row.getValue("product_name")}</p>
			</div>
		),
	},
	{
		header: "Price",
		accessorKey: "unit_price",
		cell: ({ row }) => formatCurrency(row.getValue("unit_price")),
	},
	{
		header: () => <p className="text-center">Quantity</p>,
		accessorKey: "quantity",
		cell: ({ row }) => <p className="text-center">x{row.getValue("quantity")}</p>,
	},
	{
		header: "Total price",
		accessorKey: "total_price",
		// @ts-expect-error nil
		cell: ({ row }) => formatCurrency(row.getValue("unit_price") * row.getValue("quantity")),
	},
]

export const Invoice = () => {
	const { id } = useParams()
	const { data: order, isPending } = useQuery({
		queryFn: () => GetOrderQuery(String(id)),
		queryKey: ["get-order", id],
		enabled: !!id,
	})

	const table = useReactTable({
		data: order?.data.items || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<>
			<h3 className="text-lg font-semibold">Invoice</h3>

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

					<TableRow>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell className="text-center">Subtotal</TableCell>
						<TableCell>{formatCurrency(Number(order?.data.total_amount ?? 0))}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell className="text-center">Discount</TableCell>
						<TableCell>
							{order?.data.is_coupon_applied
								? formatCurrency(Number(order.data.general_coupon.amount))
								: formatCurrency(Number(0))}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell></TableCell>
						<TableCell></TableCell>

						<TableCell className="text-center">Fees</TableCell>
						<TableCell>{formatCurrency(Number(order?.data.delivery_amount ?? 0))}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell></TableCell>
						<TableCell></TableCell>

						<TableCell className="text-center font-body text-primary">Total</TableCell>
						<TableCell className="font-body text-lg font-bold text-primary">
							{formatCurrency(Number(order?.data.grand_total ?? 0))}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	)
}
