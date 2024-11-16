import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from "recharts"
import { format } from "date-fns"

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartProps {
	data?: {
		amount: number
		day_or_month: Date | string
	}[]
}

export const ChartBar = ({ data }: BarChartProps) => {
	const config = {
		amount: {
			label: "Amount",
			color: "var(--primary)",
		},
		day_or_month: {
			label: "Day",
			color: "var(--primary)",
		},
	} satisfies ChartConfig

	return (
		<ChartContainer config={config} className="h-[300px]">
			<BarChart accessibilityLayer data={data}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="day_or_month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={64}
					tickFormatter={(value) => format(new Date(value), "dd")}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent nameKey="amount" labelFormatter={(value) => format(value, "dd/MM/yy")} />
					}
				/>
				<Bar dataKey="amount" fill="var(--primary)" className="w-3" radius={4} />
				<YAxis />
			</BarChart>
		</ChartContainer>
	)
}
