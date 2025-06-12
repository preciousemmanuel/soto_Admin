import { ChartArea } from "@/components/charts/area"
import { DataCard, DataTable, Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PAGE_LIMIT } from "@/config"
import { useDebounce, usePageTitle } from "@/hooks"
import { formatCurrency, getInitials } from "@/lib"
import { GetBuyersQuery, GetOverviewQuery } from "@/queries"
import type { BuyersProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { SearchNormal1 } from "iconsax-react"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"


type BuyerDetails = BuyersProps["data"][number]
const columns: ColumnDef<BuyerDetails>[] = [
	{
		header: "Buyer",
		accessorKey: "first_name",
		cell: ({ row }) => {
			const full_name = `${row.original.FirstName} ${row.original.LastName}`

			return (
				<div className="flex items-center gap-2.5">
					<Avatar className="size-9">
						<AvatarImage src={row.original.ProfileImage} alt={full_name} />
						<AvatarFallback>{getInitials(full_name)}</AvatarFallback>
					</Avatar>

					<div>
						<p className="font-medium capitalize leading-none">{full_name}</p>
						<span className="text-xs text-gray-400">{row.original.Email}</span>
					</div>
				</div>
			)
		},
	},
	{
		header: () => <p className="text-center">Total Orders</p>,
		accessorKey: "total_orders",
		cell: ({ row }) => <p className="text-center">{row.getValue("total_orders")}</p>,
	},
	{
		header: () => <p className="text-center">Total Items Ordered</p>,
		accessorKey: "total_items_ordered",
		cell: ({ row }) => <p className="text-center">{row.getValue("total_items_ordered")}</p>,
	},
	{
		header: "Total Spent",
		accessorKey: "total_spent",
		cell: ({ row }) => (
			<span className="text-center">{formatCurrency(row.getValue("total_spent"))}</span>
		),
	},
	{
		header: "Last Order Amount",
		accessorKey: "last_order_price",
		cell: ({ row }) => (
			<span className="text-center">{formatCurrency(row.getValue("last_order_price"))}</span>
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
						to={`/dashboard/buyers/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View Buyer
					</Link>
				</PopoverContent>
			</Popover>
		),
	},
]

const Buyers = () => {
	usePageTitle("Buyers")
	// const [timeLine, setTimeLine] = React.useState<TimelineProps>("")
	const [query, setQuery] = React.useState("")
	const buyer_name = useDebounce(query, 500)
	const [searchParams] = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () => GetBuyersQuery({ page, limit: PAGE_LIMIT, search: buyer_name }),
		queryKey: ["get-buyers", page, buyer_name],
		placeholderData: keepPreviousData,
	})
	const { data: overview } = useQuery({
		queryFn: () => GetOverviewQuery({ timeLine: "" }),
		queryKey: ["get-overview", ""],
	})

	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Buyer's Management</h2>

				<div className="flex items-center gap-6">
					<div className="relative flex items-center gap-2">
						<SearchNormal1 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5F6B7A]" />
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-96 rounded-md border-0 bg-neutral-50 px-3 py-2.5 pl-12 outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus-visible:ring-primary"
							placeholder="Search by buyer's name"
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
							amount={overview?.data.buyers.amount}
							percentage_change={overview?.data.buyers.percentage_change}
						/>
						<DataCard
							label="Sellers"
							amount={overview?.data.sellers.amount}
							percentage_change={overview?.data.sellers.percentage_change}
						/>
						<DataCard
							label="Orders"
							amount={overview?.data.orders.amount}
							percentage_change={Number(overview?.data.orders.percentage_change.toFixed(2))}
						/>
					</div>

					<div className="grid grid-cols-5 gap-6">
						<div className="col-span-3 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="font-medium text-gray-700">Revenue Generated from Buyers</p>

							{data && <ChartArea data={data?.data.revenue_from_buyers_chart || []} />}
						</div>

						<div className="col-span-2 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="font-medium">Buyer Info</p>

							<div className="text-sm">
								<div className="flex flex-col items-center justify-center gap-2 border-b border-b-gray-200 pb-6 text-center">
									<Avatar className="size-20">
										<AvatarImage src="" alt={data?.data.data.at(0)?.FirstName} />
										<AvatarFallback className="text-xl">
											{getInitials(data?.data.data.at(0)?.FirstName || "")}
										</AvatarFallback>
									</Avatar>

									<div>
										<p className="font-bold capitalize">
											{data?.data.data.at(0)?.FirstName} {data?.data.data.at(0)?.LastName}
										</p>
										<p className="text-xs">{data?.data.data.at(0)?.Email}</p>
									</div>
								</div>

								<ul className="grid grid-cols-2 gap-6 p-6">
									<li>
										<p className="text-xs font-medium">Total Orders</p>
										<p>{data?.data.data.at(0)?.total_orders}</p>
									</li>
									<li>
										<p className="text-xs font-medium">Total Items Ordered</p>
										<p>{data?.data.data.at(0)?.total_items_ordered}</p>
									</li>

									<li>
										<p className="text-xs font-medium">Total Spent</p>
										<p>{formatCurrency(data?.data.data.at(0)?.total_spent || 0)}</p>
									</li>

									<li>
										<p className="text-xs font-medium">Last Order Amount</p>
										<p>{formatCurrency(data?.data.data.at(0)?.last_order_price || 0)}</p>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-8 border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between">
							<p className="text-lg font-medium">All Buyers</p>
						</div>

						<DataTable
							columns={columns}
							data={data?.data.data || []}
							totalPages={totalPages}
							isPlaceholderData={isPlaceholderData}
						/>
					</div>
				</>
			)}
		</section>
	)
}

export default Buyers
