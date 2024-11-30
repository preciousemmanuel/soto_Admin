import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { formatDate } from "date-fns"

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
					left: 0,
					right: 0,
					bottom: 24,
				}}>
				<CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.8} />
				<XAxis
					dataKey="day_or_month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(value) => formatDate(new Date(value), "dd/MM/yyyy")}
				/>
				<YAxis tickFormatter={(value) => value?.toLocaleString()} />
				<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
				<Area
					dataKey="amount"
					type="natural"
					fill="#ff5733"
					fillOpacity={0.2}
					strokeWidth={1.5}
					stroke="#ff5733"
				/>
			</AreaChart>
		</ChartContainer>
	)
}
