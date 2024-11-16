import { ArrowRight, MoreHorizontal } from "lucide-react"
import { SearchNormal1 } from "iconsax-react"
import { Link } from "react-router-dom"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartPie } from "@/components/charts"
import { getWeekRanges } from "@/lib"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

const Sellers = () => {
	const ranges = getWeekRanges(new Date("2024-06-01"))

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Buyer's Management</p>
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
			<div className="my-5 flex w-full flex-col gap-14">
				<div className="grid w-full grid-cols-4 gap-7">
					{[...Array(4)].map((_, index) => (
						<div
							key={index}
							className="h-[97px] w-full rounded-xl border-0.5 border-[#f8f3f3] bg-white shadow-card shadow-primary/[8%]"></div>
					))}
				</div>
				<div className="grid h-[441px] w-full grid-cols-6 gap-5">
					<div className="col-span-4 h-full w-full rounded-2xl bg-white p-[30px] shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="size-[7px] rounded-full bg-primary"></span>
								<p className="text-sm font-medium">Revenue generated from sellers</p>
							</div>
							<Link to="" className="flex items-center gap-3 text-sm font-medium">
								View Details <ArrowRight size={16} />
							</Link>
						</div>
						<ChartPie
							data={[
								{ status: "active", users: 400 },
								{ status: "inactive", users: 50 },
								{ status: "suspended", users: 25 },
								{ status: "banned", users: 5 },
							]}
						/>
					</div>
					<div className="col-span-2 h-full w-full rounded-2xl bg-white px-4 py-7 shadow-card shadow-primary/[8%]">
						<p className="text-sm font-medium">Sellers Status</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col gap-7 rounded-2xl border-0.5 border-[#f8f3f3] p-[27px] shadow-card shadow-primary/[8%]">
				<div className="flex w-full items-center justify-between">
					<p className="text-2xl font-medium">All Sellers</p>
					<Link to="" className="flex items-center gap-3 text-sm font-medium text-primary">
						More <ArrowRight size={16} />
					</Link>
				</div>
				<Table>
					<TableHeader className="bg-[#f8f8f8]">
						<TableRow>
							<TableHead className="">Products</TableHead>
							<TableHead className="">Sellers</TableHead>
							<TableHead className="">Qty</TableHead>
							<TableHead className="">Categories</TableHead>
							<TableHead className="">Revenue</TableHead>
							<TableHead className="">Net Profit</TableHead>
							<TableHead className="">Status</TableHead>
							<TableHead className="">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody></TableBody>
				</Table>
			</div>
		</div>
	)
}

export default Sellers
