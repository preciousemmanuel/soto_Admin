import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Pagination } from "../ui/pagination"
import { Spinner } from "./spinner"

interface Props<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	totalPages?: number
	isLoading?: boolean
	isPlaceholderData?: boolean
}

export function DataTable<TData, TValue>({
	columns,
	data,
	totalPages,
	isLoading,
	isPlaceholderData,
}: Props<TData, TValue>) {
	// const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	// const [sorting, setSorting] = React.useState<SortingState>([])
	// const [rowSelection, setRowSelection] = React.useState({})

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		// onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		// onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		// onRowSelectionChange: setRowSelection,
		// state: {
		// 	sorting,
		// 	columnFilters,
		// 	rowSelection,
		// },
	})

	return (
		<div className="w-full">
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
				<TableBody className={`transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="whitespace-nowrap">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="text-center">
								{isLoading ? (
									<div className="flex items-center justify-center">
										<Spinner variant="primary" size="lg" />
									</div>
								) : (
									<span>No result(s).</span>
								)}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{data && totalPages ? <Pagination totalPages={totalPages} /> : null}
		</div>
	)
}
