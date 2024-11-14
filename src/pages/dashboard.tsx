import { ArrowRight, Info, MoreHorizontal } from "lucide-react"
import { useQueries } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import React from "react"

import { aggregateAmount, formatCurrency, formatPrice, getInitials, getRange } from "@/lib"
import { GetBestSellerQuery, GetLatestOrdersQuery, GetOverviewQuery } from "@/queries"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartBar, ChartLine, ChartRadial } from "@/components/charts"
import { OverviewItem } from "@/components/table"
import { DataCard } from "@/components/shared"
import { frequencyFilter } from "@/config"
import { TimelineProps } from "@/types"
import { usePageTitle } from "@/hooks"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const LIMIT = 10

const Dashboard = () => {
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("")
	const [page] = React.useState(1)
	usePageTitle("Dashboard")

	const [{ data: overview }, { data: best_seller }, { data: latest_orders }] = useQueries({
		queries: [
			{
				queryFn: () => GetOverviewQuery({ timeLine, page, limit: LIMIT }),
				queryKey: ["get-overview", timeLine, page],
			},
			{
				queryFn: () => GetBestSellerQuery({ timeLine, page, limit: LIMIT }),
				queryKey: ["get-best-seller", timeLine, page],
			},
			{
				queryFn: () => GetLatestOrdersQuery({ timeLine, page, limit: LIMIT }),
				queryKey: ["get-latest-orders", timeLine, page],
			},
		],
	})

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Dashboard</p>
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
			</div>
			<div className="my-5 flex w-full flex-col gap-14">
				<div className="flex w-full flex-col">
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
							percentage_change={overview?.data.orders.percentage_change}
						/>
					</div>
				</div>
				<div className="grid h-[352px] w-full grid-cols-6 gap-[62px]">
					<div className="col-span-4 flex h-full flex-col gap-7 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-[27px] shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Dashboard</p>
						</div>
						{/* <ChartBar data={overview?.data.advanced_report} /> */}
						<ChartBar
							data={[
								{ amount: 50000, day_or_month: "2024-11-01T14:05:03.000Z" },
								{ amount: 100000, day_or_month: "2024-11-02T14:05:03.000Z" },
								{ amount: 65000, day_or_month: "2024-11-03T14:05:03.000Z" },
								{ amount: 42000, day_or_month: "2024-11-04T14:05:03.000Z" },
								{ amount: 78000, day_or_month: "2024-11-05T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-06T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-07T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-08T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-07T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-08T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-09T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-10T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-11T14:05:03.000Z" },
								{ amount: 55400, day_or_month: "2024-11-12T14:05:03.000Z" },
							]}
						/>
					</div>
					<div className="col-span-2 flex h-full flex-col items-center gap-7 rounded-xl bg-[#fcfafa] p-[27px]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Cart</p>
							<button className="text-neutral-500">
								<Info />
							</button>
						</div>
						<ChartRadial progress={overview?.data.cart.percentage} />
						<div className="flex w-full flex-col">
							<div className="flex w-full items-center justify-between">
								<p className="text-sm font-medium">Abandoned Cart</p>
								<p className="text-sm">{overview?.data.cart.abandonned_cart}</p>
							</div>
							<div className="flex w-full items-center justify-between">
								<p className="text-sm font-medium">Abandoned Revenue</p>
								<p className="text-sm">{formatCurrency(overview?.data.cart.abandonned_revenue ?? 0)}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="grid h-[460px] w-full grid-cols-5 gap-[18px]">
					<div className="col-span-2 flex h-full flex-col gap-7 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-[27px] shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Analytics</p>
						</div>
						<div className="flex h-[84px] w-[197px] flex-col justify-center rounded-xl border-0.5 border-[#f8f3f3] bg-white px-7 shadow-card shadow-primary/[8%]">
							<div className="flex w-full items-center justify-between text-[10px]">
								<p>Order Metrics</p>
								<p className=""></p>
							</div>
							<p className="text-xl font-semibold">{aggregateAmount(overview?.data.advanced_report)}</p>
						</div>
						<p className="text-sm font-medium text-neutral-400">
							{getRange(overview?.data.advanced_report)} order metric count
						</p>
						<ChartLine data={[]} />
					</div>
					<div className="col-span-3 flex h-full flex-col gap-11 rounded-xl bg-[#fcfafa] p-[27px]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Best Selling Products</p>
							<Link to="" className="flex items-center gap-3 text-sm font-medium text-primary">
								More <ArrowRight size={16} />
							</Link>
						</div>
						<div className="flex w-full flex-col px-2">
							<div className="grid h-6 w-full grid-cols-6 text-sm font-medium">
								<div className="col-span-3">Product</div>
								<div className="col-span-1">Price</div>
								<div className="col-span-1">Sold</div>
								<div className="col-span-1">Total</div>
							</div>
							{best_seller?.data.data.map((bs, index) => (
								<div key={index} className="grid w-full grid-cols-6 border-b py-2 text-sm last:border-0">
									<div className="col-span-3 flex items-center gap-1 font-medium capitalize">
										<Avatar className="size-9">
											<AvatarImage src="" alt={bs.product_name} />
											<AvatarFallback>{getInitials(bs.product_name)}</AvatarFallback>
										</Avatar>
										{bs.product_name}
									</div>
									<div className="col-span-1">{formatPrice(0)}</div>
									<div className="col-span-1">{bs.total_quantity}</div>
									<div className="col-span-1">{formatPrice(bs.total_price)}</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col gap-7 rounded-2xl border-0.5 border-[#f8f3f3] p-[27px] shadow-card shadow-primary/[8%]">
					<div className="flex w-full items-center justify-between">
						<p className="text-2xl font-medium">Latest Orders</p>
						<Link to="" className="flex items-center gap-3 text-sm font-medium text-primary">
							More <ArrowRight size={16} />
						</Link>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Products</TableHead>
								<TableHead>Qty</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Revenue</TableHead>
								<TableHead>Net Profit</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{latest_orders?.data.data.map((order, index) => <OverviewItem key={index} order={order} />)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
