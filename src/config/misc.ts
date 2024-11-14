import { TimelineProps } from "@/types"

interface FrequencyFilter {
	label: string
	value: TimelineProps
}

export const frequencyFilter: FrequencyFilter[] = [
	{ label: "All", value: "ALL" },
	{ label: "Today", value: "TODAY" },
	{ label: "Yesterday", value: "YESTERDAY" },
	{ label: "Last 7 days", value: "LAST_7_DAYS" },
	{ label: "This week", value: "THIS_WEEK" },
	{ label: "Last week", value: "LAST_WEEK" },
	{ label: "This month", value: "THIS_MONTH" },
	{ label: "Last 6 months", value: "LAST_6_MONTHS" },
	{ label: "Last 12 months", value: "LAST_12_MONTHS" },
]
