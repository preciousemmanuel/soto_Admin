import { UpdateCouponModal } from "@/components/modals"
import { DataTable } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PAGE_LIMIT } from "@/config"
import { usePageTitle } from "@/hooks"
import { GetCouponsQuery } from "@/queries/coupon"
import type { CouponProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal, Plus, Tag } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

const tabs = ["all"]
const defaultData: never[] = []

const columns: ColumnDef<CouponProps>[] = [
	{
		header: "Coupon Name",
		accessorKey: "name",
		// size: 400,
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="grid size-10 place-items-center rounded bg-primary text-sm text-white">
					<Tag className="size-5" />
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

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Coupon & Promotion</h2>

				<div className="flex items-center gap-6">
					<Button asChild>
						<Link to="/dashboard/coupon-and-promo/create">
							<Plus />
							<span>Create New</span>
						</Link>
					</Button>
				</div>
			</header>

			<Tabs defaultValue="all">
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger key={tab} value={tab}>
							{tab} Coupons
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="all">
					<DataTable
						columns={columns}
						data={data?.data || defaultData}
						isLoading={isPending}
						totalPages={totalPages}
						isPlaceholderData={isPlaceholderData}
					/>
				</TabsContent>
			</Tabs>
		</section>
	)
}

export default Coupon
