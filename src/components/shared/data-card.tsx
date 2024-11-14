interface Props {
	amount?: number
	label?: string
	percentage_change?: number
}

export const DataCard = ({ amount, label, percentage_change }: Props) => {
	return (
		<div className="flex h-[97px] w-full flex-col items-center justify-center rounded-xl border-0.5 border-[#f8f3f3] bg-white px-7 shadow-card shadow-primary/[8%]">
			<div className="flex w-full items-center justify-between">
				<p className="text-xs font-medium">{label}</p>
				<p
					className={`text-xs font-medium ${percentage_change !== undefined && percentage_change < 0 ? "text-red-600" : "text-green-600"}`}>
					{percentage_change ?? 0}%
				</p>
			</div>
			<div className="flex w-full items-center justify-between">
				<p className="text-2xl font-semibold">{amount ?? 0}</p>
				<div></div>
			</div>
		</div>
	)
}