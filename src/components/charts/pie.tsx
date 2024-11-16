import { Label, Pie, PieChart } from "recharts"
import * as React from "react"

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

interface PieChartProps {
	data: {
		status: "active" | "inactive" | "suspended" | "banned" | (string & {})
		users: number
	}[]
}

export const ChartPie = ({ data }: PieChartProps) => {
	const totalUsers = React.useMemo(() => {
		return data.reduce((acc, curr) => acc + curr.users, 0)
	}, [data])

	const config = {
		users: {
			label: "Users",
		},
		active: {
			label: "Active",
			color: "#12ab5c",
		},
		inactive: {
			label: "Inactive",
			color: "#a7a6a6",
		},
		suspended: {
			label: "Suspended",
			color: "#fc876e",
		},
		banned: {
			label: "Banned",
			color: "#fefb56",
		},
	} satisfies ChartConfig

	return (
		<ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
			<PieChart>
				<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
				<Pie data={data} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
					<Label
						content={({ viewBox }) => {
							if (viewBox && "cx" in viewBox && "cy" in viewBox) {
								return (
									<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
										<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
											{totalUsers.toLocaleString()}
										</tspan>
										<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
											Visitors
										</tspan>
									</text>
								)
							}
						}}
					/>
				</Pie>
			</PieChart>
		</ChartContainer>
	)
}
