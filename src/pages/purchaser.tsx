import { useNavigate } from "react-router-dom"
import React from "react"

import { Button } from "@/components/ui/button"
import { frequencyFilter } from "@/config"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const tabs = ["pending", "picked", "delivered", "cancelled"] as const
type Tabs = (typeof tabs)[number]

const Orders = () => {
	const [activeTab, setActiveTab] = React.useState<Tabs>("pending")
	const navigate = useNavigate()

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Order Management</p>
				<div className="flex items-center gap-6">
					<Button onClick={() => navigate(-1)} variant="outline">
						Back
					</Button>
					<Button>Block Purchaser</Button>
				</div>
			</div>
			<div className="my-5 flex w-full flex-col gap-4">
				<div className="flex w-full items-center gap-[30px] border-b">
					{tabs.map((tab) => (
						<button
							key={tab}
							className={`relative py-2 capitalize transition-all before:absolute before:-bottom-0.5 before:left-0 before:h-0.5 before:bg-primary ${
								tab === activeTab ? "before:w-full" : "before:w-0"
							}`}
							onClick={() => setActiveTab(tab)}>
							<p className="text-[16px] font-medium">{tab}</p>
						</button>
					))}
				</div>
				<div className="flex w-full items-center justify-end">
					<Select>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Filter by date range" />
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
				<div className="w-full pt-5">
					<Table>
						<TableHeader className="bg-[#f8f8f8] text-black">
							<TableRow>
								<TableHead className="">Product</TableHead>
								<TableHead className="">Purchaser</TableHead>
								<TableHead className="">Assigned</TableHead>
								<TableHead className="">Qty</TableHead>
								<TableHead className="">Seller</TableHead>
								<TableHead className="">Status</TableHead>
								<TableHead className="">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody></TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}

export default Orders
