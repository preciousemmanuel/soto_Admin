import { addDays, addWeeks, format } from "date-fns"

type RangeProps = {
	amount: number
	day_or_month: Date | string
}

/**
 * @description Get the week ranges for a given date
 * @param startDate - The start date of the week ranges
 * @returns An array of week ranges
 */
export const getWeekRanges = (startDate: Date | string, length = 26) => {
	const start = new Date(startDate)

	return Array.from({ length }, (_, i) => {
		const weekStart = addWeeks(start, i)
		const weekEnd = addDays(weekStart, 6)
		return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`
	})
}

/**
 * @description Get the date range for the provided data.
 * @param data - An array of objects with a `day_or_month` property of type `Date | string`.
 * @returns A string representing the date range in the format "MMM d - MMM d".
 */
export const getRange = (data?: RangeProps[]) => {
	if (!data || data.length === 0) {
		return ""
	}
	const start = new Date(data[0].day_or_month)
	const end = new Date(data[data.length - 1].day_or_month)
	return `${format(start, "MMM d")} - ${format(end, "MMM d")}`
}
