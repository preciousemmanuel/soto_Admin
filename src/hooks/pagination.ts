import { useMemo, useState } from "react"

function range(start: number, end: number) {
	const length = end - start + 1
	return Array.from({ length }, (_, index) => index + start)
}

export const DOTS = "dots"

interface PaginationParams {
	/** Controlled active page number */
	page?: number

	/** Total amount of pages */
	total: number

	/** Siblings amount on left/right side of selected page, defaults to 1 */
	siblings?: number

	/** Amount of elements visible on left/right edges, defaults to 1  */
	boundaries?: number
}

/**
 * Generates a pagination object based on the given parameters.
 *
 * @param {number} params.total - The total number of items.
 * @param {number} [params.siblings=1] - The number of sibling page numbers to display.
 * @param {number} [params.boundaries=1] - The number of boundary page numbers to display.
 * @param {number} params.page - The current active page number.
 * @return {object} - The pagination object.
 * @property {Array<number | "dots">} range - The range of page numbers to display.
 * @property {number} active - The current active page number.
 * @property {function} setPage - A function to set the active page number.
 * @property {function} next - A function to navigate to the next page.
 * @property {function} previous - A function to navigate to the previous page.
 * @property {function} first - A function to navigate to the first page.
 * @property {function} last - A function to navigate to the last page.
 */
export const usePagination = ({
	total,
	siblings = 1,
	boundaries = 1,
	page = 1,
}: PaginationParams) => {
	const _total = Math.max(Math.trunc(total), 0)
	const [activePage, setActivePage] = useState(page)

	const setPage = (pageNumber: number) => {
		if (pageNumber <= 0) {
			setActivePage(1)
		} else if (pageNumber > _total) {
			setActivePage(_total)
		} else {
			setActivePage(pageNumber)
		}
	}

	const next = () => setPage(activePage + 1)
	const previous = () => setPage(activePage - 1)
	const first = () => setPage(1)
	const last = () => setPage(_total)

	const paginationRange = useMemo((): (number | "dots")[] => {
		const totalPageNumbers = siblings * 2 + 3 + boundaries * 2
		if (totalPageNumbers >= _total) {
			return range(1, _total)
		}

		const leftSiblingIndex = Math.max(activePage - siblings, boundaries)
		const rightSiblingIndex = Math.min(activePage + siblings, _total - boundaries)

		const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
		const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1)

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = siblings * 2 + boundaries + 2
			return [...range(1, leftItemCount), DOTS, ...range(_total - (boundaries - 1), _total)]
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = boundaries + 1 + 2 * siblings
			return [...range(1, boundaries), DOTS, ...range(_total - rightItemCount, _total)]
		}

		return [
			...range(1, boundaries),
			DOTS,
			...range(leftSiblingIndex, rightSiblingIndex),
			DOTS,
			...range(_total - boundaries + 1, _total),
		]
	}, [siblings, boundaries, _total, activePage])

	return {
		range: paginationRange,
		active: activePage,
		setPage,
		next,
		previous,
		first,
		last,
	}
}
