import { addDays, addWeeks, format } from "date-fns"

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
