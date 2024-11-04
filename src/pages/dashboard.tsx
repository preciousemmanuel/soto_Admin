import { ArrowRight, Info, MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"

import { getWeekRanges } from "@/lib"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

const Dashboard = () => {
	const ranges = getWeekRanges(new Date("2024-06-01"))

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Dashboard</p>
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
					<button className="text-neutral-500">
						<MoreHorizontal />
					</button>
				</div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14">
				<div className="flex w-full flex-col">
					<div className="grid w-full grid-cols-4 gap-7">
						{[...Array(4)].map((_, index) => (
							<div
								key={index}
								className="h-[97px] w-full rounded-xl border-0.5 border-[#f8f3f3] bg-white shadow-card shadow-primary/[8%]"></div>
						))}
					</div>
				</div>
				<div className="grid h-[352px] w-full grid-cols-6 gap-[62px]">
					<div className="col-span-4 flex h-full flex-col gap-7 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-[27px] shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Dashboard</p>
							<Link
								to=""
								className="flex items-center gap-3 text-sm font-medium text-neutral-500">
								Advanced Report <ArrowRight size={16} />
							</Link>
						</div>
					</div>
					<div className="col-span-2 flex h-full flex-col gap-7 rounded-xl p-[27px]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Cart</p>
							<button className="text-neutral-500">
								<Info />
							</button>
						</div>
					</div>
				</div>
				<div className="grid h-[460px] w-full grid-cols-5 gap-[18px]">
					<div className="col-span-2 flex h-full flex-col gap-7 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-[27px] shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Analytics</p>
						</div>
					</div>
					<div className="col-span-3 flex h-full flex-col gap-7 rounded-xl p-[27px]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl font-medium">Best Selling Products</p>
							<Link
								to=""
								className="flex items-center gap-3 text-sm font-medium text-primary">
								More <ArrowRight size={16} />
							</Link>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col gap-7 rounded-2xl border-0.5 border-[#f8f3f3] p-[27px] shadow-card shadow-primary/[8%]">
					<div className="flex w-full items-center justify-between">
						<p className="text-2xl font-medium">Latest Orders</p>
						<Link
							to=""
							className="flex items-center gap-3 text-sm font-medium text-primary">
							More <ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
