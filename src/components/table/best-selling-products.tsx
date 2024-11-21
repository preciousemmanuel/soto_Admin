import { formatPrice, getInitials } from "@/lib"
import { GetBestSellerQuery } from "@/queries"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type Props = {
	page: number
	timeLine: string
}

type Product = {
	product_id: string
	product_name: string
	total_quantity: number
	total_price: number
	images: string
}

const columns: ColumnDef<Product>[] = [
	{
		header: "Product",
		accessorKey: "product_name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar className="size-9">
					<AvatarImage src={row.original.images} alt={row.getValue("product_name")} />
					<AvatarFallback>{getInitials(row.getValue("product_name"))}</AvatarFallback>
				</Avatar>
				<p className="truncate capitalize">{row.getValue("product_name")}</p>
			</div>
		),
	},
	{
		header: "Price",
		accessorKey: "total_price",
		// @ts-expect-error nil
		cell: ({ row }) => formatPrice(row.getValue("total_price") / row.getValue("total_quantity")),
	},
	{
		header: () => <p className="text-center">Sold</p>,
		accessorKey: "total_quantity",
		cell: ({ row }) => <p className="text-center">x{row.getValue("total_quantity")}</p>,
	},
	{
		header: "Total",
		accessorKey: "total_price",
		cell: ({ row }) => formatPrice(row.getValue("total_price")),
	},
]

export const BestSellingProducts = ({ page, timeLine }: Props) => {
	const { data } = useQuery({
		queryFn: () => GetBestSellerQuery({ timeLine, page, limit: 10 }),
		queryKey: ["get-best-seller", timeLine, page],
	})
	const table = useReactTable({
		data: data?.data.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className="col-span-3 flex h-full flex-col gap-6 overflow-y-auto rounded-xl bg-[#fcfafa] p-[27px]">
			<div className="flex w-full items-center justify-between">
				<p className="text-xl font-medium">Best Selling Products</p>
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
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
