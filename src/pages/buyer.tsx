import { Spinner } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { statusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { formatCurrency, formatPrice } from "@/lib"
import { GetBuyerQuery } from "@/queries"
import type { BuyerProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { format, formatDistanceStrict } from "date-fns"
import { useNavigate, useParams } from "react-router-dom"

type BuyerOrder = BuyerProps["orderRecords"]["data"][number]
const columns: ColumnDef<BuyerOrder>[] = [
	{
		header: "Orders ID",
		accessorKey: "_id",
		cell: ({ row }) => <p>#{row.original._id.substring(0, 8)}</p>,
	},
	{
		header: "Date",
		accessorKey: "createdAt",
		cell: ({ row }) => (
			<span className="text-center">
				{format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm a")}
			</span>
		),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<p className={statusClass[row.getValue("status") as keyof typeof statusClass]}>
				{row.getValue("status")}
			</p>
		),
	},
	{
		header: "Amount",
		accessorKey: "grand_total",
		cell: ({ row }) => <span className="capitalize">{formatPrice(row.getValue("grand_total"))}</span>,
	},
]

const Buyer = () => {
	usePageTitle("Buyer")
	const { id } = useParams()
	const navigate = useNavigate()

	const { data, isPending } = useQuery({
		queryFn: () => GetBuyerQuery(String(id)),
		queryKey: ["get-buyer", id],
	})
	const table = useReactTable({
		data: data?.data.orderRecords.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const totalPages = Number(data?.data.orderRecords.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Buyer's Details</h2>

				<div className="flex items-center gap-6">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button className="w-32">Block Buyer</Button>
				</div>
			</header>

			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<>
					<div className="grid grid-cols-3 gap-6">
						<div className="col-span-2 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white px-6 py-8 shadow-card shadow-primary/[8%]">
							<div className="flex items-start gap-4 border-b border-b-[#E9EAF3] pb-8">
								<img src="" alt="" className="size-20 rounded-full bg-red-200" />

								<div className="flex flex-1 items-center justify-between">
									<div className="flex flex-col gap-1 text-sm text-[#939393]">
										<h3 className="text-base font-bold capitalize text-gray-900">
											{data?.data.user.FirstName} {data?.data.user.LastName}
										</h3>
										<p className="font-semibold text-primary">{data?.data.user.Rank}</p>
										<p>{data?.data.user.ShippingAddress.city}</p>
										<p>{data?.data.orderRecords.pagination.totalCount} orders</p>
										<p>
											Customer for {/* @ts-expect-error nil */}
											{formatDistanceStrict(new Date(data?.data.user.createdAt), new Date(), {
												addSuffix: false,
											})}
										</p>
									</div>

									<div></div>
								</div>
							</div>

							{/* <div className="flex flex-col gap-1 text-sm text-[#939393]">
								<p className="font-medium capitalize text-gray-900">Seller's Business</p>

								<p className="capitalise">Business name: {data?.data.user.business.business_name}</p>
								<p className="capitalise">Business description: {data?.data.user.business.description}</p>
								<p className="capitalise">Business category: {data?.data.user.business.category}</p>
							</div> */}
						</div>

						<div className="col-span-1 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<div className="flex items-center justify-between">
								<p className="font-semibold">Overview</p>

								<button type="button" className="text-sm text-primary">
									Edit
								</button>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Shipping Address</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.user.ShippingAddress.full_address}
								</p>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Email Address</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.user.Email}
								</p>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Phone number</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.user.PhoneNumber}
								</p>
							</div>

							<div className="flex flex-col gap-2 border-t border-t-[#E9EAF3] pt-4">
								<button type="button" className="text-left text-sm text-red-600">
									Remove Buyer
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-6">
						<div className="col-span-2 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white px-6 py-8 shadow-card shadow-primary/[8%]">
							<p className="font-semibold">Buyer Orders</p>

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
												<span>No product(s) found.</span>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>

							{!isPending ? <Pagination totalPages={totalPages} /> : null}
						</div>

						<div className="col-span-1 flex h-fit flex-col gap-6 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="font-semibold">Total Amount Spent</p>

							<p className="font-body text-4xl font-bold text-primary">
								{formatCurrency(data?.data.total_amount_spent ?? 0)}
							</p>

							<p className="w-fit rounded bg-[#FFE8E3] px-6 py-1 text-xs font-medium text-primary">
								{data?.data.user.Rank}
							</p>
						</div>
					</div>
				</>
			)}
		</section>
	)
}

export default Buyer
