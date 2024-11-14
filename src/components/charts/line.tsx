import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

interface LineChartProps {
	data?: {
		amount: number
		day_or_month: Date | string
	}[]
	formatter?: (value: unknown, index: number) => string
}

export const ChartLine = ({ data }: LineChartProps) => {
	const config = {
		amount: {
			label: "Amount",
			color: "var(--primary)",
		},
	} satisfies ChartConfig

	return (
		<div className="h-[165px] w-full">
			<ChartContainer config={config}>
				<LineChart
					accessibilityLayer
					data={data}
					margin={{
						left: 12,
						right: 12,
					}}>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="day_or_month"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
					<Line
						dataKey="amount"
						type="natural"
						stroke="var(--primary)"
						strokeWidth={2}
						dot={{
							fill: "var(--primary)",
						}}
						activeDot={{
							r: 6,
						}}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	)
}
