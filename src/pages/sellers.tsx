import { ChartPie } from "@/components/charts"
import { ChartArea } from "@/components/charts/area"
import { ApproveUserModal, RemoveUserModal } from "@/components/modals"
import { DataCard, DataTable, Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PAGE_LIMIT } from "@/config"
import { useDebounce, usePageTitle } from "@/hooks"
import { formattedStats, getInitials } from "@/lib"
import { GetOverviewQuery, GetSellersQuery } from "@/queries"
import type { SellersProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { SearchNormal1 } from "iconsax-react"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"

const tabs = ["approved", "pending", "blocked", "declined"]

type Sellers = SellersProps["sellers_data"]["data"][number]
const statusClass = {
	true: "text-[#0E973E]",
	false: "text-[#7F7F7F]",
}

const columns: ColumnDef<Sellers>[] = [
	{
		header: "Seller",
		accessorKey: "FirstName",
		cell: ({ row }) => (
			<div className="flex items-center gap-2.5">
				<Avatar className="size-9">
					<AvatarImage src="" alt={row.getValue("FirstName")} />
					<AvatarFallback>{getInitials(row.getValue("FirstName"))}</AvatarFallback>
				</Avatar>

				<div>
					<p className="font-medium capitalize leading-none">{row.getValue("FirstName")}</p>
					<span className="text-xs text-gray-400">{row.original.FirstName}</span>
				</div>
			</div>
		),
	},
	{
		header: () => <p>QTY</p>,
		accessorKey: "total_quantity",
		cell: ({ row }) => (
			<span className="text-center">{row.getValue("total_quantity")?.toLocaleString()}</span>
		),
	},
	{
		header: "Category",
		accessorKey: "category",
		cell: ({ row }) => <span className="capitalize">{row.getValue("category")}</span>,
	},
	{
		header: "Seller Status",
		accessorKey: "isVerified",
		cell: ({ row }) => (
			<p>{row.original.IsVerified ? "Verified" : row.original.IsBlocked ? "Blocked" : "Pending"}</p>
		),
	},
	{
		header: "Active Status",
		accessorKey: "IsActive",
		cell: ({ row }) => (
			<p className={statusClass[row.getValue("IsActive") as keyof typeof statusClass]}>
				{row.getValue("IsActive") ? "Active" : "Inactive"}
			</p>
		),
	},
	{
		header: "Joined Date",
		accessorKey: "createdAt",
		cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
	},
	{
		header: "Action",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>

				<PopoverContent>
					<Link
						to={`/dashboard/sellers/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View seller
					</Link>

					{!row.original.IsVerified ? (
						<ApproveUserModal
							id={row.original._id}
							name={`${row.original.FirstName} ${row.original.LastName}`}
						/>
					) : null}

					<RemoveUserModal
						id={row.original._id}
						name={`${row.original.FirstName} ${row.original.LastName}`}
						isBlocked={row.original.IsBlocked}
					/>
				</PopoverContent>
			</Popover>
		),
	},
]

const Sellers = () => {
	usePageTitle("Sellers")
	const [searchParams, setSearchParams] = useSearchParams()
	const page = Number(searchParams.get("page")) || 1
	const status = searchParams.get("status") ?? tabs[0]

	const [query, setQuery] = React.useState("")
	const seller_name = useDebounce(query, 500)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () =>
			GetSellersQuery({
				page,
				limit: PAGE_LIMIT,
				search: seller_name,
				seller_status: status.toUpperCase(),
			}),
		queryKey: ["get-sellers", page, seller_name, status],
		placeholderData: keepPreviousData,
	})

	const { data: overview } = useQuery({
		queryFn: () => GetOverviewQuery({ timeLine: "" }),
		queryKey: ["get-overview", ""],
	})

	const totalPages = Number(data?.data.sellers_data.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Seller’s Management</h2>

				<div className="flex items-center gap-6">
					<div className="relative flex items-center gap-2">
						<SearchNormal1 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5F6B7A]" />
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-96 rounded-md border-0 bg-neutral-50 px-3 py-2.5 pl-12 outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus-visible:ring-primary"
							placeholder="Search by seller name"
						/>
					</div>
				</div>
			</header>

			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<>
					{/* overview cards */}
					<div className="grid w-full grid-cols-4 gap-7">
						<DataCard
							label="Revenue"
							amount={overview?.data.revenue.amount}
							percentage_change={overview?.data.revenue.percentage_change}
						/>
						<DataCard
							label="Buyers"
							amount={overview?.data.visitors.amount}
							percentage_change={overview?.data.visitors.percentage_change}
						/>
						<DataCard
							label="Sellers"
							amount={overview?.data.conversion.amount}
							percentage_change={overview?.data.conversion.percentage_change}
						/>
						<DataCard
							label="Orders"
							amount={overview?.data.orders.amount}
							percentage_change={Number(overview?.data.orders.percentage_change.toFixed(2) || 0)}
						/>
					</div>

					<div className="grid grid-cols-5 gap-6">
						<div className="col-span-3 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="font-medium text-gray-700">Revenue Generated from Sellers</p>

							{data && <ChartArea data={data?.data.revenue_from_sellers_chart || []} />}
						</div>

						<div className="col-span-2 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="font-medium">Sellers Status</p>

							{data && <ChartPie data={formattedStats(data?.data.stats)} />}

							<ul className="flex items-center justify-center gap-4 text-xs text-[#6B6B6B]">
								<li className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-[#0E973E]" />
									<span>Active</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-[#7F7F7F]" />
									<span>Inactive</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-[#dc2626]" />
									<span>Blocked</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-[#FEAA1D]" />
									<span>Others</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="flex flex-col gap-8 border-0.5 border-[#f8f3f3] bg-white px-6 py-4 shadow-card shadow-primary/[8%]">
						{/* <p className="text-2xl font-medium">Sellers</p> */}

						<Tabs
							defaultValue={status ?? tabs[0]}
							value={status ?? tabs[0]}
							onValueChange={(value) => {
								searchParams.set("status", value)
								setSearchParams(searchParams)
							}}>
							<TabsList>
								{tabs.map((tab) => (
									<TabsTrigger key={tab} value={tab}>
										{tab} Seller
									</TabsTrigger>
								))}
							</TabsList>

							{tabs.map((tab) => (
								<TabsContent key={tab} value={tab}>
									<DataTable
										columns={columns}
										data={data?.data.sellers_data.data || []}
										totalPages={totalPages}
										isPlaceholderData={isPlaceholderData}
									/>
								</TabsContent>
							))}
						</Tabs>
					</div>
				</>
			)}
		</section>
	)
}

export default Sellers
