import { UpdatePurchaserOrderStatusModal } from "@/components/modals"
import { RemovePurchaserModal } from "@/components/modals/remove-purchaser"
import { UpdatePurchaserModal } from "@/components/modals/update-purchaser"
import { DataTable, Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PAGE_LIMIT, pickupsStatusClass } from "@/config"
import { capitalize, getInitials, getTimeFromNow } from "@/lib"
import { GetPickupsQuery, GetPurchaserQuery } from "@/queries/purchaser"
import type { PickupsProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDistanceStrict } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"

type PickupsDetails = PickupsProps["data"][number]
const columns: ColumnDef<PickupsDetails>[] = [
	{
		header: "Order ID",
		accessorKey: "order_id",
		// @ts-expect-error nil
		cell: ({ row }) => <p>#{row.getValue("order_id").substring(0, 8)}</p>,
	},
	{
		header: "Pickup ID",
		accessorKey: "_id",
		// @ts-expect-error nil
		cell: ({ row }) => <p>#{row.getValue("_id").substring(0, 8)}</p>,
	},
	{
		header: "Purchaser",
		accessorKey: "purchaser",
		cell: ({ row }) => {
			const full_name = `${row.original.purchaser.first_name} ${row.original.purchaser.last_name}`

			return (
				<div className="flex items-center gap-2.5">
					<Avatar className="size-9">
						<AvatarImage src={row.original.purchaser.profile_image} alt={full_name} />
						<AvatarFallback>{getInitials(full_name)}</AvatarFallback>
					</Avatar>

					<p className="font-medium capitalize leading-none">{full_name}</p>
				</div>
			)
		},
	},
	{
		header: "Assigned",
		accessorKey: "createdAt",
		cell: ({ row }) => getTimeFromNow(row.getValue("createdAt")),
	},
	{
		header: () => <p className="text-center">QTY</p>,
		accessorKey: "quantity",
		cell: ({ row }) => <p className="text-center">{row.getValue("quantity")}</p>,
	},
	{
		header: "Vendor",
		accessorKey: "vendor_contact",
		cell: ({ row }) => <p className="capitalize">{row.original.vendor_contact.first_name}</p>,
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<span
				className={`text-sm capitalize ${pickupsStatusClass[row.getValue("status") as keyof typeof pickupsStatusClass]}`}>
				{capitalize(row.getValue("status"))}
			</span>
		),
	},
	{
		header: "Actions",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>

				<PopoverContent>
					{/* <Link
						to={`/dashboard/purchasers/${row.original.purchaser._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View purchaser
					</Link> */}

					<Link
						to={`/dashboard/orders/${row.original.order_id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View order
					</Link>

					<UpdatePurchaserOrderStatusModal id={row.original._id} />
				</PopoverContent>
			</Popover>
		),
	},
]

const Purchaser = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	// const status = searchParams.get("status") || ""
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending } = useQuery({
		queryFn: () => GetPurchaserQuery(String(id)),
		queryKey: ["get-purchaser", id],
	})
	const {
		data: pickups,
		isPending: pickupPending,
		isPlaceholderData,
	} = useQuery({
		queryFn: () => GetPickupsQuery({ page, limit: PAGE_LIMIT, purchaser: id }),
		queryKey: ["get-pickups", id, page],
		placeholderData: keepPreviousData,
	})
	const totalPages = Number(pickups?.data.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Purchaser's Details</h2>

				<Button variant="outline" onClick={() => navigate(-1)}>
					Back
				</Button>
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
											{data?.data.FirstName} {data?.data.LastName}
										</h3>
										{/* <p className="font-semibold text-primary">{data?.data.user.Rank}</p> */}
										<p className="capitalize">
											{data?.data.address_details.city}, {data?.data.address_details.country}
										</p>
										{/* <p>{data?.data.orderRecords.pagination.totalCount} orders</p> */}
										<p>
											Purchaser for {/* @ts-expect-error nil */}
											{formatDistanceStrict(new Date(data?.data.createdAt), new Date(), {
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
								<p className="font-semibold">Other info</p>

								<UpdatePurchaserModal />
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Purchaser Location</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.address_details.full_address}
								</p>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Purchaser Email</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">{data?.data.Email}</p>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium text-[#666666]">Phone number</p>
								<p className="text-pretty text-xs leading-relaxed text-[#979797]">
									{data?.data.PhoneNumber}
								</p>
							</div>

							<div className="flex flex-col gap-2 border-t border-t-[#E9EAF3] pt-4">
								<RemovePurchaserModal
									id={data?.data._id}
									name={`${data?.data.FirstName} ${data?.data.LastName}`}
								/>
							</div>
						</div>
					</div>

					<div className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
						<DataTable
							columns={columns}
							data={pickups?.data.data || []}
							totalPages={totalPages}
							isPlaceholderData={isPlaceholderData}
							isLoading={pickupPending}
						/>
					</div>
				</>
			)}
		</section>
	)
}
export default Purchaser
