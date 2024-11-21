import { ChartLine } from "@/components/charts"
import { DataCard } from "@/components/shared"
import { LatestOrdersTable } from "@/components/table"
import { BestSellingProducts } from "@/components/table/best-selling-products"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { frequencyFilter, PAGE_LIMIT } from "@/config"
import { usePageTitle } from "@/hooks"
import { aggregateAmount, getRange } from "@/lib"
import { GetOverviewQuery } from "@/queries"
import type { TimelineProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import React from "react"

const Dashboard = () => {
	usePageTitle("Dashboard")
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("")
	const [page, setPage] = React.useState(1)

	const { data: overview } = useQuery({
		queryFn: () => GetOverviewQuery({ timeLine, page, limit: PAGE_LIMIT }),
		queryKey: ["get-overview", timeLine, page],
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Dashboard</h2>

				<div className="flex items-center gap-6">
					<Select value={timeLine} onValueChange={setTimeLine}>
						<SelectTrigger className="w-[166px] border-0">
							<SelectValue placeholder="Select Range" />
						</SelectTrigger>
						<SelectContent>
							{frequencyFilter.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
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
					percentage_change={overview?.data.orders.percentage_change.toFixed(2)}
				/>
			</div>

			{/* analytics */}
			<div className="grid max-h-[460px] w-full grid-cols-5 gap-5">
				<div className="col-span-2 flex h-full flex-col gap-7 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-[27px] shadow-card shadow-primary/[8%]">
					<p className="text-xl font-medium">Analytics</p>

					<div className="flex h-[84px] w-[197px] flex-col justify-center rounded-xl border-0.5 border-[#f8f3f3] bg-white px-7 shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between text-[10px]">
							<p className="text-xs font-medium text-[#6B6B6B]">Order Metrics</p>
							<p className=""></p>
						</div>
						<p className="text-xl font-semibold">{aggregateAmount(overview?.data.advanced_report)}</p>
					</div>
					<p className="text-sm font-medium text-neutral-400">
						{getRange(overview?.data.advanced_report)} order metric count
					</p>
					<ChartLine data={[]} />
				</div>

				<BestSellingProducts page={page} timeLine={timeLine} />
			</div>

			{/* Data Table */}
			<LatestOrdersTable timeLine={timeLine} page={page} />
		</section>
	)
}

export default Dashboard
