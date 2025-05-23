import { CancelOrderModal, UpdateTrackingStatusModal } from "@/components/modals"
import { Spinner } from "@/components/shared"
import { Invoice } from "@/components/table"
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

const tabs = ["order details", "products", "invoice"] as const
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
		header: "Assigned purchaser",
		// accessorKey: "assigned_purchaser.",
		cell: ({ row }) => {
			const full_name = row.original.assigned_purchaser
				? `${row.original.assigned_purchaser.FirstName} ${row.original.assigned_purchaser.LastName}`
				: ""
			// console.log("full name", full_name)

			return full_name ? (
				<div className="flex items-center gap-2">
					<Avatar className="size-9">
						<AvatarImage src={row.original.assigned_purchaser.ProfileImage} alt={full_name} />
						<AvatarFallback>{getInitials(full_name)}</AvatarFallback>
					</Avatar>

					<div>
						<p>{full_name}</p>
						<p className="text-xs">{row.original.vendor.Email}</p>
					</div>
				</div>
			) : (
				<p>N/A</p>
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
						to={`/dashboard/products/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View product
					</Link>

					<Link
						to={`/dashboard/purchasers/${row.original?.assigned_purchaser ? row.original.assigned_purchaser._id : ""}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View purchaser
					</Link>
				</PopoverContent>
			</Popover>
		),
	},
]

const arrayFromObject = (obj = {}) =>
	Object.entries(obj).map((item) => ({
		step: item[0],
		value: item[1],
	}))

const Order = () => {
	usePageTitle("Order")
	const { id } = useParams()
	const navigate = useNavigate()

	const [searchParams, setSearchParams] = useSearchParams()
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
	const owner = `${order?.data.user.FirstName} ${order?.data.user.LastName}`
	const order_timeline = arrayFromObject(order?.data.order_itinerary || {})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Order Details</h2>

				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>

					<CancelOrderModal
						id={id ?? ""}
						owner={owner}
						trigger={<Button disabled={order?.data.status === "CANCELLED"}>Cancel Order</Button>}
					/>
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
						<div className="grid grid-cols-6 gap-8">
							<div className="col-span-4">
								<h3 className="text-lg font-semibold">
									Order Details -{" "}
									<span className="text-neutral-400">#{order?.data._id.substring(0, 6)}</span>
								</h3>

								<div className="grid w-full grid-cols-2 items-center justify-between gap-10 pt-12 text-sm">
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

									<div className="flex flex-col gap-4">
										<div className="flex flex-col">
											<p className="font-semibold">Payment Method:</p>
											<p className="capitalize">
												{order?.data.payment_details ? order?.data.payment_details.at(0)?.payment_provider : ""}
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
											<p>
												Payment Status:{" "}
												<span
													className={`${transactionStatusClass[order?.data.status as keyof typeof transactionStatusClass]}`}>
													{order?.data.payment_details ? order?.data.payment_details.at(0)?.status : ""}
												</span>
											</p>
											<p>Tracking ID: {order?.data.tracking_id}</p>
										</div>
									</div>
								</div>
							</div>

							<div className="col-span-2 flex flex-col gap-10 rounded-lg border border-neutral-100 bg-neutral-50 p-8">
								<ol className="relative flex flex-col gap-7 border-l border-primary/30 py-2 text-sm">
									{order_timeline.length ? (
										order_timeline?.map((item) => (
											<li className="ml-5" key={item.step}>
												<div className="bg-imsme-primary absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
												<div className="flex flex-col gap-1">
													<p className="text-xs font-normal uppercase leading-none text-neutral-500">
														Level 00{item.step.split("_")[1]}
													</p>

													{/* @ts-expect-error nil */}
													<p className="text-pretty text-xs font-medium leading-relaxed">{item.value}</p>
												</div>
											</li>
										))
									) : (
										<li>No timeline</li>
									)}
								</ol>

								<UpdateTrackingStatusModal level={order_timeline.length} />
							</div>
						</div>
					)}
				</TabsContent>

				<TabsContent className="flex flex-col gap-4 text-[#3A3C40]" value="products">
					<h3 className="text-lg font-semibold">Order products</h3>

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
					<Invoice />
				</TabsContent>
			</Tabs>
		</section>
	)
}

export default Order
