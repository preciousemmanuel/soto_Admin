import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

interface Props {
	data: {
		amount: number
		day_or_month: Date | string
	}[]
}

export const ChartArea = ({ data }: Props) => {
	const config = {
		revenue: {
			label: "Revenue",
			color: "var(--primary)",
		},
	} satisfies ChartConfig

	return (
		<ChartContainer config={config}>
			<AreaChart
				accessibilityLayer
				data={data}
				margin={{
					left: 12,
					right: 12,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(value) =>
						new Intl.DateTimeFormat("en-NG", { day: "2-digit" }).format(new Date(value))
					}
				/>
				<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
				<Area
					dataKey="desktop"
					type="natural"
					fill="var(--color-desktop)"
					fillOpacity={0.4}
					stroke="var(--color-desktop)"
				/>
			</AreaChart>
		</ChartContainer>
	)
}
