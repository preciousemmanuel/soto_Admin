import { Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { statusClass, transactionStatusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { formatCurrency, formatPrice, getInitials } from "@/lib"
import { GetOrderQuery } from "@/queries"
import type { OrderProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"

const tabs = ["order details", "invoice"] as const
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
		header: "Seller",
		accessorKey: "vendor.FirstName",
		cell: ({ row }) => {
			const full_name = `${row.original.vendor.FirstName} ${row.original.vendor.LastName}`

			return (
				<div className="flex items-center gap-2">
					<Avatar className="size-9">
						<AvatarImage src="" alt={row.getValue("product_name")} />
						<AvatarFallback>{getInitials(full_name)}</AvatarFallback>
					</Avatar>

					<div>
						<p className="capitalize">{full_name}</p>
						<p className="text-xs">{row.original.vendor.Email}</p>
					</div>
				</div>
			)
		},
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
	{
		header: "Actions",
		id: "actions",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>

				<PopoverContent>
					<Link
						to={`/dashboard/sellers/${row.original.vendor._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View seller
					</Link>

					<Link
						to={`/dashboard/product/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View product
					</Link>
				</PopoverContent>
			</Popover>
		),
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

	const calculateFee = () => {
		let fee = 0

		if (order?.data.shipment_charges && order.data.is_coupon_applied) {
			fee = order.data.grand_total - (order.data.total_amount - order.data.general_coupon.amount)
			return fee
		}

		if (order?.data.shipment_charges) {
			fee = order.data.grand_total - order.data.total_amount
			return fee
		}
	}

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

							<div className="grid w-full grid-cols-3 items-center justify-between gap-10 pt-12 text-sm">
								<div className="flex flex-col gap-8">
									<div className="flex flex-col">
										<p className="font-semibold">Order by:</p>
										<p className="capitalize">
											{order?.data.user.FirstName} {order?.data.user.LastName}
										</p>
									</div>

									<div className="flex flex-col">
										<p className="">{order?.data.shipping_address}</p>
										<p className="">Phone Number</p>
									</div>
									{/* <div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage src="" alt="" />
											<AvatarFallback>{getInitials("")}</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<p className="font-semibold">Product Seller</p>
											<p>Product Seller</p>
										</div>
									</div> */}
								</div>

								<div className="flex flex-col gap-4">
									<div className="flex flex-col">
										<p className="font-semibold">Payment Method:</p>
										<p className="capitalize">{order?.data.payment_details.at(0)?.payment_provider}</p>
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
										<p>
											Payment Status:{" "}
											<span
												className={`${transactionStatusClass[order?.data.status as keyof typeof transactionStatusClass]}`}>
												{order?.data.payment_details.at(0)?.status}
											</span>
										</p>
										<p>Tracking ID: {order?.data.tracking_id}</p>
									</div>
								</div>

								<div className="flex flex-col gap-6">
									<p className="font-semibold">Shipping Details</p>
									<div className="flex w-full flex-col gap-3">
										<div className="flex flex-col">
											<p className="font-medium">Address</p>
											<p className="text-[#939393]">{order?.data.shipping_address}</p>
										</div>
										<div className="flex flex-col">
											<p className="font-medium">Email</p>
											<p className="text-[#939393]">{order?.data.user.Email}</p>
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

							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								{/* <TableCell></TableCell> */}
								<TableCell className="text-center">Subtotal</TableCell>
								<TableCell>{formatCurrency(Number(order?.data.total_amount))}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								{/* <TableCell></TableCell> */}
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
								<TableCell></TableCell>
								{/* <TableCell></TableCell> */}
								<TableCell className="text-center">Fees</TableCell>
								<TableCell>
									{/* @ts-expect-error nil */}
									{order?.data.shipment_charges ? formatCurrency(calculateFee()) : formatCurrency(Number(0))}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								{/* <TableCell></TableCell> */}
								<TableCell className="text-center font-body text-primary">Total</TableCell>
								<TableCell className="font-body text-lg font-bold text-primary">
									{formatCurrency(Number(order?.data.grand_total))}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TabsContent>
			</Tabs>
		</section>
	)
}

export default Order
