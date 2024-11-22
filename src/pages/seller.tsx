import { Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { usePageTitle } from "@/hooks"
import { formatCurrency, getInitials } from "@/lib"
import { GetSellerQuery } from "@/queries"
import type { SellerProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { formatDistanceStrict } from "date-fns"
import { useNavigate, useParams } from "react-router-dom"

const statusClass = {
	true: "text-[#0E973E]",
	false: "text-[#7F7F7F]",
}

type SellerProducts = SellerProps["product_records"]["data"][number]
const columns: ColumnDef<SellerProducts>[] = [
	{
		header: "Products",
		accessorKey: "product_name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2.5">
				<Avatar className="size-9">
					<AvatarImage src="" alt={row.getValue("product_name")} />
					<AvatarFallback>{getInitials(row.getValue("product_name"))}</AvatarFallback>
				</Avatar>

				<p className="font-medium capitalize leading-none">{row.getValue("product_name")}</p>
			</div>
		),
	},
	{
		header: () => <p>QTY</p>,
		accessorKey: "product_quantity",
		cell: ({ row }) => (
			<span className="text-center">{row.getValue("product_quantity")?.toLocaleString()}</span>
		),
	},
	{
		header: "Status",
		accessorKey: "is_verified",
		cell: ({ row }) => (
			<p className={statusClass[row.getValue("is_verified") as keyof typeof statusClass]}>
				{row.getValue("is_verified") ? "Active" : "Inactive"}
			</p>
		),
	},
	{
		header: "Price",
		accessorKey: "unit_price",
		cell: ({ row }) => (
			<span className="capitalize">{formatCurrency(row.getValue("unit_price"))}</span>
		),
	},
]

const Seller = () => {
	usePageTitle("Seller")
	const { id } = useParams()
	const navigate = useNavigate()

	const { data, isPending } = useQuery({
		queryFn: () => GetSellerQuery(String(id)),
		queryKey: ["get-sellers", id],
	})
	const table = useReactTable({
		data: data?.data.product_records.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const totalPages = Number(data?.data.product_records.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Seller’s Details</h2>

				<div className="flex items-center gap-6">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button className="w-32">Block Seller</Button>
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
								<img
									src={data?.data.user.business.business_logo}
									alt=""
									className="size-20 rounded-full bg-red-200"
								/>

								<div className="flex flex-1 items-center justify-between">
									<div className="flex flex-col gap-1 text-sm text-[#939393]">
										<h3 className="text-base font-bold capitalize text-gray-900">
											{data?.data.user.FirstName} {data?.data.user.LastName}
										</h3>
										<p className="font-semibold text-primary">{data?.data.user.Rank}</p>
										<p>{data?.data.user.ShippingAddress.country}</p>
										<p>{data?.data.product_records.pagination.totalCount} products</p>
										<p>
											Seller for {/* @ts-expect-error nil */}
											{formatDistanceStrict(new Date(data?.data.user.createdAt), new Date(), {
												addSuffix: false,
											})}
										</p>
									</div>

									<div></div>
								</div>
							</div>

							<div className="flex flex-col gap-1 text-sm text-[#939393]">
								<p className="font-medium capitalize text-gray-900">Seller's Business</p>

								<p className="capitalise">Business name: {data?.data.user.business.business_name}</p>
								<p className="capitalise">Business description: {data?.data.user.business.description}</p>
								<p className="capitalise">Business category: {data?.data.user.business.category}</p>
							</div>
						</div>

						<div className="col-span-1 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<div className="flex items-center justify-between">
								<p className="font-semibold">Overview</p>

								<button type="button" className="text-sm text-primary">
									Edit
								</button>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Business Address</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.user.business.adress}
								</p>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Business Email</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.user.business.email}
								</p>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Phone number</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.user.business.phone_number}
								</p>
							</div>

							<div className="flex flex-col gap-2 border-t border-t-[#E9EAF3] pt-4">
								<button type="button" className="text-left text-sm text-red-600">
									Remove Seller
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-6">
						<div className="col-span-2 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white px-6 py-8 shadow-card shadow-primary/[8%]">
							<p className="font-semibold">Seller’s Product</p>

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
							<p className="font-semibold">Total Amount Sold</p>

							<p className="font-body text-4xl font-bold text-primary">
								{formatCurrency(data?.data.total_amount_sold ?? 0)}
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

export default Seller
