export const ChartRadial = ({
	progress = 38,
	color = "#FF6B6B",
	size = 120,
	strokeWidth = 3,
}: {
	progress?: number
	color?: string
	size?: number
	strokeWidth?: number
}) => {
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI
	const offset = circumference - (progress / 100) * circumference

	return (
		<div className="relative inline-flex items-center justify-center">
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 transform">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="transparent"
					strokeWidth={strokeWidth}
					fill="none"
					className="text-muted/10"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={color}
					strokeWidth={strokeWidth}
					fill="none"
					strokeLinecap="round"
					style={{
						strokeDasharray: circumference,
						strokeDashoffset: offset,
						transition: "stroke-dashoffset 0.5s ease",
					}}
				/>
			</svg>
			<div className="absolute text-xl font-medium">{progress}%</div>
		</div>
	)
}
