import { ChartPie } from "@/components/charts"
import { ChartArea } from "@/components/charts/area"
import { DataCard } from "@/components/shared"
import { BuyersTable } from "@/components/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { PAGE_LIMIT } from "@/config"
import { useDebounce } from "@/hooks"
import { formattedStats, getWeekRanges } from "@/lib"
import { GetOverviewQuery, GetSellersQuery } from "@/queries"
import type { TimelineProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { SearchNormal1 } from "iconsax-react"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"

// const data = [
// 	{
// 		day_or_month: "Fri Nov 01 2024",
// 		amount: 0,
// 	},
// 	{
// 		day_or_month: "Fri Nov 08 2024",
// 		amount: 0,
// 	},
// 	{
// 		day_or_month: "Fri Nov 15 2024",
// 		amount: 0,
// 	},
// 	{
// 		day_or_month: "Fri Nov 22 2024",
// 		amount: 114500,
// 	},
// 	{
// 		day_or_month: "Fri Nov 29 2024",
// 		amount: 0,
// 	},
// ]

const page = 1
const Buyers = () => {
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("")
	const [query, setQuery] = React.useState("")
	const seller_name = useDebounce(query, 500)

	const ranges = getWeekRanges(new Date("2024-06-01"))
	// const [start_date, end_date] = timeLine.split(" - ")

	// console.log("timeLine", start_date, end_date)

	const { data } = useQuery({
		queryFn: () => GetSellersQuery({ page, limit: PAGE_LIMIT, search: seller_name }),
		queryKey: ["get-sellers", page, seller_name],
	})
	const { data: overview } = useQuery({
		queryFn: () => GetOverviewQuery({ timeLine }),
		queryKey: ["get-overview", timeLine],
	})

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

					<Select value={timeLine} onValueChange={setTimeLine}>
						<SelectTrigger className="w-[166px] border-0">
							<SelectValue placeholder="Select Range" />
						</SelectTrigger>
						<SelectContent>
							{ranges.map((value) => (
								<SelectItem key={value} value={value}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Popover>
						<PopoverTrigger className="text-neutral-500">
							<MoreHorizontal />
						</PopoverTrigger>
						<PopoverContent></PopoverContent>
					</Popover>
				</div>
			</header>

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

			{/* sellers table */}
			<BuyersTable search={seller_name} />
		</section>
	)
}

export default Buyers
