import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
				<CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.8} />

				<XAxis
					dataKey="day_or_month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={64}
					tickFormatter={(value) => format(new Date(value), "dd")}
				/>
				<YAxis tickFormatter={(value) => value?.toLocaleString()} />

				<ChartTooltip
					content={
						<ChartTooltipContent nameKey="amount" labelFormatter={(value) => format(value, "dd/MM/yy")} />
					}
				/>
				<Bar barSize={4} dataKey="amount" fill="var(--primary)" radius={4} />
			</BarChart>
		</ChartContainer>
	)
}
