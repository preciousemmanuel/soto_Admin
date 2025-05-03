import { UpdateDisputeModal } from "@/components/modals/update-dispute"
import { Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { capitalize, formatCurrency, getInitials } from "@/lib"
import { GetDisputeQuery } from "@/queries/dispute"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Link, useNavigate, useParams } from "react-router-dom"

const statusClass = {
	RESOLVED: "text-green-600",
	CANCELLED: "text-red-600",
	PENDING: "text-yellow-600",
}

const Dispute = () => {
	const { id } = useParams()
	const navigate = useNavigate()

	const { data, isPending } = useQuery({
		queryFn: () => GetDisputeQuery(String(id)),
		queryKey: ["get-dispute", id],
	})
	const fullname = `${data?.data.user.FirstName} ${data?.data.user.LastName}`

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Dispute Details</h2>

				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>

					<Button
						className="w-32 bg-neutral-600 text-neutral-100 hover:bg-neutral-700"
						asChild
						variant="secondary"
						disabled={data?.data?.status === "RESOLVED"}>
						<Link to={`/dashboard/orders/${data?.data?.order}`}>View Order</Link>
					</Button>
					<UpdateDisputeModal
						id={id ?? ""}
						trigger={
							<Button className="w-36" disabled={data?.data?.status === "RESOLVED"}>
								Update Dispute
							</Button>
						}
					/>
				</div>
			</header>

			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<div className="grid grid-cols-5 gap-14">
					<div className="col-span-2 flex h-max flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-8 shadow-card shadow-primary/[8%]">
						<div>
							<p className="text-[11px] uppercase tracking-wide">Dispute ID:</p>
							<p className="text-sm">#{data?.data._id.substring(0, 8)}</p>
						</div>

						<div>
							<p className="text-[11px] uppercase tracking-wide">Tracking Code:</p>
							<p className="text-sm">{data?.data.code}</p>
						</div>

						<div>
							<p className="text-[11px] uppercase tracking-wide">Dispute Title:</p>
							<p className="text-sm">{capitalize(data?.data.title)}</p>
						</div>

						<div>
							<p className="text-[11px] uppercase tracking-wide">Dispute Description:</p>
							<p className="text-sm">{data?.data.description}r</p>
						</div>

						<div>
							<p className="text-[11px] uppercase tracking-wide">Created by:</p>
							<div className="flex items-center gap-2.5">
								<Avatar className="size-9">
									<AvatarImage src="" alt={fullname} />
									<AvatarFallback className="text-sm">{getInitials(fullname)}</AvatarFallback>
								</Avatar>

								<p className="text-sm capitalize leading-none">{fullname}</p>
							</div>
						</div>

						<div>
							<p className="text-[11px] uppercase tracking-wide">Status:</p>
							<p
								className={`text-sm font-medium uppercase ${statusClass[data?.data.status as keyof typeof statusClass]}`}>
								{capitalize(data?.data.status)}
							</p>
						</div>

						<div>
							<p className="text-[11px] uppercase tracking-wide">Attended to by:</p>
							{data?.data.admin ? (
								<div className="flex items-center gap-2.5">
									<Avatar className="size-9">
										<AvatarImage src="" alt={fullname} />
										<AvatarFallback className="text-sm">
											{getInitials(`${data?.data.admin.FirstName} ${data?.data.admin.LastName}`)}
										</AvatarFallback>
									</Avatar>

									<p className="text-sm capitalize leading-none">
										{data?.data.admin.FirstName} {data?.data.admin.LastName}
									</p>
								</div>
							) : (
								<p className="text-sm">-</p>
							)}
						</div>

						<div>
							<p className="text-[11px] uppercase tracking-wide">Date:</p>
							<p className="text-sm">{format(data?.data?.createdAt as string, "MMM d, yyyy hh:mm a")}</p>
						</div>
					</div>

					<div className="col-span-3 flex flex-col gap-10">
						<div className="flex flex-col gap-4 rounded-md bg-[#FFEFEB] p-4">
							<h4 className="text-sm font-medium">Attached Images</h4>

							<div className="flex items-center gap-4">
								{data?.data?.images?.length ? (
									data?.data?.images?.map((image) => (
										<img src={image} alt="product image" className="size-40 rounded-lg" />
									))
								) : (
									<p className="text-xs italic text-neutral-600">No attached image(s)</p>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-4 rounded-md bg-[#FFEFEB] p-4">
							<h4 className="text-sm font-medium">Order Products</h4>

							<ul className="rounded-md bg-white p-4">
								{data?.data?.order_details?.items?.map((item) => (
									<li
										key={item?._id}
										className="flex flex-row items-center gap-4 border-b border-b-neutral-200 pb-4 last:border-b-0 last:pb-0">
										<img src={item?.images[0]} alt={item?.product_name} className="size-20" />

										<div className="text-sm">
											<p className="capitalize">{item?.product_name}</p>
											<p className="text-xs text-[#808089]">Qty: {item?.quantity}</p>
											<p className="text-xs text-[#808089]">
												Price: {formatCurrency(item?.unit_price * item?.quantity)}
											</p>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="flex flex-col gap-4 rounded-md bg-[#FFEFEB] p-4">
							<div className="flex flex-col gap-3">
								<h4 className="text-sm">General Info</h4>

								<ul className="rounded-md bg-white p-4">
									<li className="flex items-center justify-between gap-1 border-b border-b-neutral-200 pb-4 text-sm">
										<p>Order ID</p>
										<p>#{data?.data?.order_details?._id?.substring(0, 8)}</p>
									</li>
									<li className="flex items-center justify-between gap-1 pt-4 text-sm">
										<p>Order Date</p>
										<p>{data?.data?.order_details?.createdAt ? format(new Date(data.data.order_details.createdAt), "MMM d, yyyy hh:mm a") : "-"}</p>
									</li>
								</ul>
							</div>

							<div className="flex flex-col gap-3">
								<h4 className="text-sm">Payment Info</h4>

								{data?.data?.order_details?.payment_details?.length ? (
									<ul className="rounded-md bg-white p-4">
										<li className="flex items-center justify-between gap-1 border-b border-b-neutral-200 pb-4 text-sm">
											<p>Payment Status</p>
											<p>{data?.data?.order_details?.payment_details?.at(-1)?.status ?? "-"}</p>
										</li>
										<li className="flex items-center justify-between gap-1 pt-4 text-sm">
											<p>Total Amount</p>
											<p>{formatCurrency(data?.data?.order_details?.grand_total)}</p>
										</li>
									</ul>
								) : null}
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	)
}

export default Dispute
