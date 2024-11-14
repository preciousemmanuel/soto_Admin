import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice, getInitials } from "@/lib"
import { TabPanel } from "@/components/shared"
import { GetOrderQuery } from "@/queries"

const tabs = ["order details", "product", "invoice"] as const
type Tabs = (typeof tabs)[number]

const Order = () => {
	const [current, setCurrent] = React.useState<Tabs>("order details")
	const { id } = useParams()

	const { data: order } = useQuery({
		queryFn: () => GetOrderQuery(String(id)),
		queryKey: ["get-order", id],
		enabled: !!id,
	})

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Order Details</p>
				<div className="flex items-center gap-6"></div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14">
				<div className="flex w-full flex-col rounded-xl shadow-card shadow-primary/[8%]">
					<div className="flex w-full items-center gap-[31px] border-b px-8 pb-5 pt-7">
						{tabs.map((tab) => (
							<button
								key={tab}
								onClick={() => setCurrent(tab)}
								className={`relative h-9 text-sm font-medium capitalize before:absolute before:bottom-0 before:left-0 before:h-0.5 before:bg-primary ${tab === current ? "text-primary before:w-full" : "before:w-0"}`}>
								{tab}
							</button>
						))}
					</div>
					<div className="w-full p-8">
						<TabPanel
							selectedTab={current}
							tabValue="order details"
							className="flex w-full flex-col gap-5">
							<p className="text-lg font-semibold">
								Order Details - <span className="text-neutral-400">#{order?.data._id.substring(0, 6)}</span>
							</p>
							<div className="grid w-full grid-cols-3 text-sm">
								<div className="flex w-full flex-col gap-6">
									<div className="flex flex-col">
										<p className="font-semibold">Order From</p>
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
								<div className="flex w-full flex-col gap-6">
									<p className="font-semibold">Payment Method</p>
									<div className="flex w-full flex-col gap-3">
										<p></p>
										<p>Amount: {formatPrice(order?.data.total_amount ?? 0)}</p>
										<p>Payment ID: {}</p>
										<p>
											Date:{" "}
											{order?.data.createdAt && format(new Date(String(order?.data.createdAt)), "dd-MM-yyyy")}
										</p>
										<p>Status: {}</p>
									</div>
								</div>
								<div className="flex w-full flex-col gap-6">
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
						</TabPanel>
						<TabPanel selectedTab={current} tabValue="product" className="flex w-full flex-col gap-5">
							<p className="text-lg font-semibold">Product</p>
							<div className="flex flex-col text-sm">
								<div className="grid h-9 w-full grid-cols-5 font-medium text-neutral-400">
									<div className="col-span-2 flex items-center">Product</div>
									<div className="flex items-center">Price</div>
									<div className="flex items-center">Quantity</div>
									<div className="flex items-center">Total</div>
								</div>
								{order?.data.items.map((item) => (
									<div key={item._id} className="grid h-9 w-full grid-cols-5 border-t">
										<div className="col-span-2 flex items-center capitalize">{item.product_name}</div>
										<div className="flex items-center">{formatPrice(item.unit_price)}</div>
										<div className="flex items-center">{item.quantity}</div>
										<div className="flex items-center">{formatPrice(item.unit_price * item.quantity)}</div>
									</div>
								))}
							</div>
						</TabPanel>
						<TabPanel selectedTab={current} tabValue="invoice" className="flex w-full flex-col gap-5">
							<p className="text-lg font-semibold">Invoice</p>
							<div className="flex items-center gap-2">
								<div className="size-40 rounded-md bg-white p-1">
									<img src="" alt="" className="size-full rounded-md object-cover" />
								</div>
								<div className="flex flex-col justify-center">
									<p className="font-medium capitalize">
										{order?.data.items.map((item) => item.product_name).join(" x ")}
									</p>
									<p className="text-sm">{order?.data.shipping_address}</p>
									<p className="text-sm"></p>
								</div>
							</div>
							<div className="flex flex-col text-sm">
								<div className="grid h-9 w-full grid-cols-5 font-medium text-neutral-400">
									<div className="col-span-2 flex items-center">Product</div>
									<div className="flex items-center">Price</div>
									<div className="flex items-center">Quantity</div>
									<div className="flex items-center">Total</div>
								</div>
								{order?.data.items.map((item) => (
									<div key={item._id} className="grid h-9 w-full grid-cols-5 border-t">
										<div className="col-span-2 flex items-center capitalize">{item.product_name}</div>
										<div className="flex items-center">{formatPrice(item.unit_price)}</div>
										<div className="flex items-center">{item.quantity}</div>
										<div className="flex items-center">{formatPrice(item.unit_price * item.quantity)}</div>
									</div>
								))}
							</div>
							<div className="flex w-full justify-end font-semibold">
								<div className="flex min-w-[300px] flex-col gap-5">
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
						</TabPanel>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Order
