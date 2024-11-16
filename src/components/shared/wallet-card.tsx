import { ArrowDown, ArrowUp, Icon, MoneySend, Wallet } from "iconsax-react"
import React from "react"

import { formatCurrency } from "@/lib"

type LabelProps = "transaction amount" | "total income" | "total withdraw" | "remittance balance"
type ColorProps = "red" | "green" | "yellow"
interface Props {
	amount?: number
	color?: ColorProps
	label?: LabelProps
	percentage_change?: number
}

const cardIcon: Record<LabelProps, Icon> = {
	"transaction amount": Wallet,
	"total income": ArrowUp,
	"total withdraw": ArrowDown,
	"remittance balance": MoneySend,
}

const chartColor: Record<ColorProps, string> = {
	red: "#ff5733",
	green: "#15ac77",
	yellow: "#fe9431",
}

export const WalletCard = ({ amount, color = "red", label, percentage_change }: Props) => {
	const points = [10, 30, 20, 45, 25, 35, 15, 40, 30, 20]

	// Calculate the points for the SVG path
	const maxPoint = Math.max(...points)
	const minPoint = Math.min(...points)
	const range = maxPoint - minPoint
	const width = 100
	const height = 100

	// Create a smooth path using cubic Bézier curves
	const pathPoints = points.map((point, i) => {
		const x = (i / (points.length - 1)) * width
		const y = height - ((point - minPoint) / range) * height
		return [x, y]
	})

	const smoothPath = pathPoints.reduce((path, point, i, points) => {
		if (i === 0) {
			return `M ${point[0]},${point[1]}`
		}
		const prev = points[i - 1]
		const next = points[i + 1] || point
		const tensionX = (next[0] - prev[0]) / 4
		return `${path} C ${prev[0] + tensionX},${prev[1]} ${point[0] - tensionX},${point[1]} ${point[0]},${point[1]}`
	}, "")

	return (
		<div className="flex aspect-[1.18/1] w-full flex-col justify-between rounded-md bg-white shadow-card shadow-primary/[8%]">
			<div className="flex w-full items-start justify-between p-6">
				<div className="flex w-[170px] flex-col gap-3">
					<p className="capitalize text-neutral-400">{label}</p>
					<p className="text-2xl font-semibold">{formatCurrency(amount ?? 0)}</p>
					<p className="text-neutral-400">
						<span className={``}>{percentage_change}</span>
					</p>
				</div>
				<div
					style={{ background: color }}
					className="grid size-[30px] place-items-center rounded-full text-white">
					{React.createElement(cardIcon[label as LabelProps], { className: "size-5" })}
				</div>
			</div>
			<svg
				className="mt-2 h-[100px] w-full"
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="none">
				<defs>
					<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={chartColor[color]} stopOpacity={0.8} />
						<stop offset="95%" stopColor={chartColor[color]} stopOpacity={0.1} />
					</linearGradient>
				</defs>
				<path
					d={smoothPath}
					fill="none"
					stroke={chartColor[color]}
					strokeWidth="1.5"
					vectorEffect="non-scaling-stroke"
					className="opacity-50"
				/>
			</svg>
		</div>
	)
}
