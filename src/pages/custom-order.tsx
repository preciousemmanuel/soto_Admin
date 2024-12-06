import { ApproveCustomOrderModal, DeclineCustomOrderModal } from "@/components/modals"
import { Spinner } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { statusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { formatPrice } from "@/lib"
import { GetOrderQuery } from "@/queries"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useNavigate, useParams } from "react-router-dom"

const CustomOrder = () => {
	usePageTitle("Order")
	const { id } = useParams()
	const navigate = useNavigate()

	const { data: order, isPending } = useQuery({
		queryFn: () => GetOrderQuery(String(id)),
		queryKey: ["get-order", id],
		enabled: !!id,
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Order Details</h2>

				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>

					{/* <CancelOrderModal
							id={id ?? ""}
							owner={owner}
							trigger={<Button disabled={order?.data.status === "CANCELLED"}>Cancel Order</Button>}
						/> */}
				</div>
			</header>

			<div>
				{isPending ? (
					<div className="flex items-center justify-center">
						<Spinner variant="primary" size="lg" />
					</div>
				) : (
					<>
						<div className="flex items-center justify-between gap-2">
							<h3 className="text-lg font-semibold">
								Order Details - <span className="text-neutral-400">#{order?.data._id.substring(0, 6)}</span>
							</h3>

							<div className="flex items-center gap-3 pt-4">
								<ApproveCustomOrderModal />

								<DeclineCustomOrderModal />
							</div>
						</div>

						<div className="grid w-full grid-cols-3 items-center justify-between gap-10 pt-12 text-sm">
							<div className="flex flex-col gap-8">
								<div className="flex flex-col">
									<p className="font-semibold">Order by:</p>
									<p className="capitalize">
										{/* {order?.data.user.FirstName} {order?.data.user.LastName} */}
									</p>
								</div>

								<div className="flex flex-col">
									<p>Email: {order?.data.email}</p>
									<p>Phone Number: {order?.data.phone_number}</p>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<p className="font-semibold">Product Info:</p>

								<div className="flex w-full flex-col gap-2 font-medium">
									<p>Product Name: {order?.data.product_name}</p>
									<p>Product Brand: {order?.data.product_brand}</p>
									<p>Size: {order?.data.size}</p>
									<p>Color: {order?.data.color}</p>
									<p>Note from buyer: {order?.data.note}</p>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<p className="font-semibold">Order Info:</p>

								<div className="flex w-full flex-col gap-2 font-medium">
									<p>
										Price Range: {formatPrice(order?.data.min_price ?? 0)} -{" "}
										{formatPrice(order?.data.max_price ?? 0)}
									</p>
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
									<p>Approval Status: {order?.data.approval_status}</p>

									<p>Tracking ID: {order?.data.tracking_id}</p>
								</div>
							</div>

							{/* <div className="flex flex-col gap-6">
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
							</div> */}
						</div>
					</>
				)}
			</div>
		</section>
	)
}

export default CustomOrder
