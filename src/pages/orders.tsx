import { OrdersTable } from "@/components/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { frequencyFilter, ORDER_TABS } from "@/config"
import { usePageTitle } from "@/hooks"
import { getWeekRanges } from "@/lib"
import type { TimelineProps } from "@/types"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { useSearchParams } from "react-router-dom"

const Orders = () => {
	usePageTitle("Orders")
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("ALL")
	const [searchParams, setSearchParams] = useSearchParams()
	// const [page] = React.useState(1)
	const ranges = getWeekRanges(new Date("2024-06-01"))

	const status = searchParams.get("status")

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Order Management</h2>

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

			<Tabs
				defaultValue={status ?? "pending"}
				value={status ?? "pending"}
				onValueChange={(value) => {
					searchParams.set("status", value)
					setSearchParams(searchParams)
				}}>
				<TabsList>
					{ORDER_TABS.map((tab) => (
						<TabsTrigger key={tab} value={tab}>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<Select>
					<SelectTrigger className="w-[166px] self-end border border-[#FFE8E3] shadow-card shadow-primary/[8%]">
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

				{ORDER_TABS.map((tab) => (
					<TabsContent key={tab} value={tab}>
						<OrdersTable timeLine={timeLine} />
					</TabsContent>
				))}
			</Tabs>
		</section>
	)
}

export default Orders
