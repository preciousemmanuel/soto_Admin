import { useQuery } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import { SearchNormal1 } from "iconsax-react"
import React from "react"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { OrderItem } from "@/components/table"
import { GetOrdersQuery } from "@/queries"
import { frequencyFilter } from "@/config"
import { TimelineProps } from "@/types"
import { usePageTitle } from "@/hooks"
import { getWeekRanges } from "@/lib"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

const LIMIT = 10
const tabs = [
	"pending",
	"confirmed",
	"processing",
	"picked",
	"shipped",
	"delivered",
	"cancelled",
] as const
type Tabs = (typeof tabs)[number]

const Orders = () => {
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("")
	const [status, setStatus] = React.useState<Tabs>("pending")
	const [page] = React.useState(1)
	const ranges = getWeekRanges(new Date("2024-06-01"))
	usePageTitle("Orders")

	const { data: orders } = useQuery({
		queryFn: () => GetOrdersQuery({ timeLine, page, limit: LIMIT, status: status.toUpperCase() }),
		queryKey: ["get-orders", timeLine, page, status],
	})

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Order Management</p>
				<div className="flex h-12 w-[329px] items-center gap-2 rounded-md border p-3">
					<SearchNormal1 className="size-5" />
					<input
						type="text"
						name="search"
						className="h-full w-full bg-transparent outline-none"
						placeholder="Search by product name"
					/>
				</div>
				<div className="flex items-center gap-6">
					<Select>
						<SelectTrigger className="w-[166px] border-0">
							<SelectValue placeholder="Select Range" />
						</SelectTrigger>
						<SelectContent>
							{ranges.map((range, index) => (
								<SelectItem key={index} value={range}>
									{range}
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
			<div className="my-5 flex w-full flex-col gap-4">
				<div className="flex w-full items-center gap-[30px] border-b">
					{tabs.map((tab) => (
						<button
							key={tab}
							className={`relative py-2 capitalize transition-all before:absolute before:-bottom-0.5 before:left-0 before:h-0.5 before:bg-primary ${
								tab === status ? "before:w-full" : "before:w-0"
							}`}
							onClick={() => setStatus(tab)}>
							<p className="text-[16px] font-medium">{tab}</p>
						</button>
					))}
				</div>
				<div className="flex w-full items-center justify-end">
					<Select value={timeLine} onValueChange={setTimeLine}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Filter by date range" />
						</SelectTrigger>
						<SelectContent>
							{frequencyFilter.map(({ label, value }) => (
								<Select key={value} value={value}>
									{label}
								</Select>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="w-full pt-5">
					<Table>
						<TableHeader className="rounded-t-lg bg-[#f8f8f8] text-black">
							<TableRow>
								<TableHead className="">Order ID</TableHead>
								<TableHead className="">Buyers</TableHead>
								<TableHead className="">Created</TableHead>
								<TableHead className="">Total</TableHead>
								<TableHead className="">Net Profit</TableHead>
								<TableHead className="">Status</TableHead>
								<TableHead className="">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders?.data.data.map((order, index) => <OrderItem key={index} order={order} />)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}

export default Orders
