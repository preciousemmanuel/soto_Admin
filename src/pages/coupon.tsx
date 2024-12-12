import { QuantityDiscountModal, UpdateCouponModal } from "@/components/modals"
import { DataTable } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PAGE_LIMIT } from "@/config"
import { usePageTitle } from "@/hooks"
import { GetCouponsQuery } from "@/queries/coupon"
import { GetCategoriesQuery } from "@/queries/shared"
import type { CouponProps } from "@/types"
import { keepPreviousData, usePrefetchQuery, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Money, PercentageSquare, TruckFast } from "iconsax-react"
import { MoreHorizontal, Plus, Tag } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

const defaultData: never[] = []
const coupon_types = [
	{
		id: 1,
		value: "FIXED_DISCOUNT",
		icon: <Money />,
	},
	{
		id: 2,
		value: "PERCENTAGE_DISCOUNT",
		icon: <PercentageSquare />,
	},
	{
		id: 3,
		value: "FREE_SHIPPING",
		icon: <TruckFast />,
	},
	{
		id: 4,
		value: "PRICE_DISCOUNT",
		icon: <Tag />,
	},
]

const columns: ColumnDef<CouponProps>[] = [
	{
		header: "Coupon Name",
		accessorKey: "name",
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="grid size-10 place-items-center rounded bg-primary text-sm text-white">
					{coupon_types.find((type) => type.value === row.original.coupon_type)?.icon}
				</div>
				<div>
					<p className="capitalize text-[#1E1E1E]">{row.getValue("name")}</p>
					<p className="text-[#979797]">{row.original.code}</p>
				</div>
			</div>
		),
	},
	{
		header: () => <span className="text-center">Usage</span>,
		accessorKey: "total_usage",
		cell: ({ row }) => <span className="text-center">{row.getValue("total_usage")} times</span>,
	},
	{
		header: "Status",
		accessorKey: "active_status",
		cell: ({ row }) => (
			<span className={`${row.original.active_status ? "text-green-600" : "text-red-600"}`}>
				{row.original.active_status ? "Active" : "Expired"}
			</span>
		),
	},
	{
		header: "Coupon Duration",
		accessorKey: "total_amount",
		cell: ({ row }) => (
			<span>
				{format(row.original.activation_date, "MMM dd, yyyy")}{" "}
				{row.original.expiry_date ? `- ${format(row.original?.expiry_date, "MMM dd, yyyy")}` : null}
			</span>
		),
	},
	{
		header: "Action",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>

				<PopoverContent>
					{/* <Link
						to={`/dashboard/orders/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						Review order
					</Link> */}

					<UpdateCouponModal coupon={row.original} />
				</PopoverContent>
			</Popover>
		),
	},
]

const Coupon = () => {
	usePageTitle("Coupon and Promo")
	const [searchParams] = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () =>
			GetCouponsQuery({
				page,
				limit: PAGE_LIMIT,
				// status: status.toUpperCase(),
			}),
		queryKey: ["get-coupons", page],
		placeholderData: keepPreviousData,
	})

	const totalPages = Number(data?.pagination.pageCount)

	usePrefetchQuery({
		queryKey: ["get-categories", 1],
		queryFn: () =>
			GetCategoriesQuery({
				page: 1,
				limit: 30,
			}),
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Coupon & Promotion</h2>

				<div className="flex items-center gap-6">
					<QuantityDiscountModal />
					<Button asChild>
						<Link to="/dashboard/coupon-and-promo/create">
							<Plus />
							<span>Create New</span>
						</Link>
					</Button>
				</div>
			</header>

			<DataTable
				columns={columns}
				data={data?.data || defaultData}
				isLoading={isPending}
				totalPages={totalPages}
				isPlaceholderData={isPlaceholderData}
			/>
		</section>
	)
}

export default Coupon
