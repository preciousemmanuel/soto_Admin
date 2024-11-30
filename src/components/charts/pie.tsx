import * as React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts"

interface PieChartProps {
	data: {
		name: string
		value: number
	}[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
	const RADIAN = Math.PI / 180
	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
	} = props
	const sin = Math.sin(-RADIAN * midAngle)
	const cos = Math.cos(-RADIAN * midAngle)
	const sx = cx + (outerRadius + 10) * cos
	const sy = cy + (outerRadius + 10) * sin
	const mx = cx + (outerRadius + 30) * cos
	const my = cy + (outerRadius + 30) * sin
	const ex = mx + (cos >= 0 ? 1 : -1) * 22
	const ey = my
	const textAnchor = cos >= 0 ? "start" : "end"

	return (
		<g>
			<text className="capitalize" x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
				{payload.name}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill="#333"
				className="text-sm capitalize">
				{payload.name}
			</text>
			<text
				className="text-xs"
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill="#999">
				{`${(percent * 100).toFixed(2)}%`}
			</text>
		</g>
	)
}

const COLORS = {
	active: "#0E973E",
	inactive: "#7F7F7F",
	blocked: "#dc2626",
	others: "#FEAA1D",
	// others: "#ff5733",
}

export const ChartPie = ({ data }: PieChartProps) => {
	const [activeIndex, setActiveIndex] = React.useState(0)

	const onPieEnter = (_: unknown, index: number) => {
		setActiveIndex(index)
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart>
				{/* <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} /> */}
				<Pie
					activeIndex={activeIndex}
					activeShape={renderActiveShape}
					data={data}
					cx="50%"
					cy="50%"
					paddingAngle={2}
					innerRadius={60}
					outerRadius={80}
					fill="#ff5733"
					dataKey="value"
					onMouseEnter={onPieEnter}>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
					))}
				</Pie>
			</PieChart>
		</ResponsiveContainer>
	)
}
