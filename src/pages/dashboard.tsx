import { ChartBar, ChartLine } from "@/components/charts"
import { DataCard, Spinner } from "@/components/shared"
import { LatestOrdersTable } from "@/components/table"
import { BestSellingProducts } from "@/components/table/best-selling-products"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { frequencyFilter } from "@/config"
import { usePageTitle } from "@/hooks"
import { aggregateAmount, formatCurrency, getRange } from "@/lib"
import { GetOverviewQuery } from "@/queries"
import type { TimelineProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import React from "react"

const Dashboard = () => {
	usePageTitle("Dashboard")
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("")

	const { data: overview, isPending } = useQuery({
		queryFn: () => GetOverviewQuery({ timeLine }),
		queryKey: ["get-overview", timeLine],
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
							percentage_change={Number(overview?.data.orders.percentage_change.toFixed(2))}
						/>
					</div>

					{/* charts */}
					<div className="grid grid-cols-5 gap-6">
						<div className="col-span-3 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="font-medium text-gray-700">Dashboard</p>
							{overview ? <ChartBar data={overview?.data.advanced_report || []} /> : null}
						</div>

						<div className="col-span-2 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="font-medium">Cart overview</p>
							<div className="flex size-52 items-center justify-center self-center rounded-full border-primary bg-white">
								<div className="flex size-36 items-center justify-center rounded-full border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
									<p className="text-3xl font-semibold">{overview?.data.cart.percentage}%</p>
								</div>
							</div>

							<ul className="mx-auto flex w-5/6 flex-col justify-center gap-2.5 text-sm">
								<li className="flex items-center justify-between font-medium">
									<p>Abandoned Cart</p>
									<p>{overview?.data.cart.abandonned_cart}</p>
								</li>
								<li className="flex items-center justify-between font-medium text-[#807C83]">
									<p>Abandoned Revenue</p>
									<p>{formatCurrency(overview?.data.cart.abandonned_revenue ?? 0)}</p>
								</li>
							</ul>
						</div>
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

						<BestSellingProducts timeLine={timeLine} />
					</div>

					{/* Data Table */}
					<LatestOrdersTable timeLine={timeLine} />
				</>
			)}
		</section>
	)
}

export default Dashboard
