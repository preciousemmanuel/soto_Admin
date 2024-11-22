import { Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { statusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { formatPrice, getInitials } from "@/lib"
import { GetOrderQuery } from "@/queries"
import type { OrderProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

const tabs = ["order details", "product", "invoice"] as const
type Tabs = (typeof tabs)[number]

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
		cell: ({ row }) => formatPrice(row.getValue("unit_price")),
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
		cell: ({ row }) => formatPrice(row.getValue("unit_price") * row.getValue("quantity")),
	},
]

const Order = () => {
	usePageTitle("Order")
	const [searchParams, setSearchParams] = useSearchParams()
	const { id } = useParams()
	const navigate = useNavigate()

	const tab = searchParams.get("tab")

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
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Order Details</h2>

				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>
					<Button>Cancel Order</Button>
				</div>
			</header>

			<Tabs
				defaultValue={tab ?? "order_details"}
				value={tab ?? "order_details"}
				onValueChange={(value) => {
					searchParams.set("tab", value.replace(" ", "_"))
					setSearchParams(searchParams)
				}}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger key={tab} value={tab.replace(" ", "_")}>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				{/* ORDER DETAILS TAB */}
				<TabsContent className="text-[#3A3C40]" value="order_details">
					{isPending ? (
						<div className="flex items-center justify-center">
							<Spinner variant="primary" size="lg" />
						</div>
					) : (
						<>
							<h3 className="text-lg font-semibold">
								Order Details - <span className="text-neutral-400">#{order?.data._id.substring(0, 6)}</span>
							</h3>

							<div className="flex w-full items-center justify-between gap-5 pt-12 text-sm">
								<div className="flex flex-col gap-8">
									<div className="flex flex-col">
										<p className="font-semibold">Order from:</p>
										<p className="capitalize">
											{order?.data.user.FirstName} {order?.data.user.LastName}
										</p>
									</div>

									<div className="flex flex-col">
										<p className="">{order?.data.shipping_address}</p>
										<p className="">Phone Number</p>
									</div>
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage src="" alt="" />
											<AvatarFallback>{getInitials("")}</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<p className="font-semibold">Product Seller</p>
											<p>Product Seller</p>
										</div>
									</div>
								</div>

								<div className="flex flex-col gap-4">
									<div className="flex flex-col">
										<p className="font-semibold">Payment Method:</p>
										<p className="capitalize">
											{order?.data.user.FirstName} {order?.data.user.LastName}
										</p>
									</div>

									<div className="flex w-full flex-col gap-2 font-medium">
										<p>Amount: {formatPrice(order?.data.total_amount ?? 0)}</p>
										<p>Payment ID: {}</p>
										<p>
											Date:{" "}
											{order?.data.createdAt && format(new Date(String(order?.data.createdAt)), "dd-MM-yyyy")}
										</p>
										<p>
											Status:{" "}
											<span className={`${statusClass[order?.data.status as keyof typeof statusClass]}`}>
												{order?.data.status}
											</span>
										</p>
									</div>
								</div>

								<div className="flex flex-col gap-6">
									<p className="font-semibold">Shipping Details</p>
									<div className="flex w-full flex-col gap-3">
										<div className="flex flex-col">
											<p className="font-medium">Address</p>
											<p>{order?.data.shipping_address}</p>
										</div>
										<div className="flex flex-col">
											<p className="font-medium">Email</p>
											<p>{order?.data.user.Email}</p>
										</div>
										<div className="flex items-center gap-2">
											<p className="font-medium">Contact</p>
											<p>{order?.data.user.PhoneNumber}</p>
										</div>
									</div>
								</div>
							</div>
						</>
					)}
				</TabsContent>

				{/* ORDER ITEMS TAB */}
				<TabsContent className="flex flex-col gap-4 text-[#3A3C40]" value="product">
					<h3 className="text-lg font-semibold">Order Products</h3>

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
				</TabsContent>

				{/* ORDER ITEM INVOICE */}
				<TabsContent className="flex flex-col gap-4 text-[#3A3C40]" value="invoice">
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
						</TableBody>
					</Table>

					<div className="flex justify-end text-sm">
						<div className="flex min-w-80 flex-col gap-5">
							<div className="flex items-center justify-between">
								<p>Subtotal</p>
								<p>{formatPrice(Number(order?.data.total_amount))}</p>
							</div>
							<div className="flex items-center justify-between">
								<p>Discount</p>
								<p>{formatPrice(Number(0))}</p>
							</div>
							<div className="flex items-center justify-between">
								<p>Fees</p>
								<p>{formatPrice(Number(0))}</p>
							</div>
							<div className="flex items-center justify-between border-t py-3 text-red-500">
								<p>Total</p>
								<p>{formatPrice(Number(order?.data.grand_total))}</p>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</section>
	)
}

export default Order
