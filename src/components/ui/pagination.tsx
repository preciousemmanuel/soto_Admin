import { usePagination } from "@/hooks"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "react-router-dom"

type PaginationProps = {
	totalPages: number
	// totalCount: number
}

export const Pagination = ({ totalPages }: PaginationProps) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const {
		range: pages,
		active,
		setPage,
	} = usePagination({
		total: totalPages,
		page: Number(searchParams.get("page") || 1),
	})

	return (
		<div className="flex items-center justify-between py-3">
			{/* <p className="text-xs font-medium text-[#999999]">Showing 1 to 10 of {totalCount} results</p> */}

			<div className="ml-auto flex items-center gap-2">
				<button
					type="button"
					disabled={active === 1}
					onClick={() => {
						setSearchParams((params) => ({
							...params,
							page: active - 1,
						}))
						setPage(active - 1)
					}}
					className="grid size-8 cursor-pointer place-items-center rounded-md border border-[#E8E8E9] transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50">
					<ChevronLeft className="size-6 text-[#999999]" />
				</button>

				<ul className="flex items-center gap-2">
					{pages.map((page, index) => {
						if (page === "dots") {
							return (
								<li key={index} className="cursor-not-allowed">
									<span className="grid size-8 cursor-pointer place-items-center rounded-md border border-[#E8E8E9] text-sm font-medium">
										...
									</span>
								</li>
							)
						}

						return (
							<li key={page}>
								<button
									type="button"
									onClick={() => {
										searchParams.set("page", String(page))
										setSearchParams(searchParams)
										setPage(page)
									}}
									className={`grid size-8 cursor-pointer place-items-center rounded-lg border text-sm font-semibold transition-colors ${page === active ? "border-primary bg-primary text-white" : "border-[#E8E8E9] bg-white text-[#999999] hover:bg-neutral-100"}`}>
									{page}
								</button>
							</li>
						)
					})}
				</ul>

				<button
					type="button"
					disabled={active === totalPages}
					onClick={() => {
						setSearchParams((params) => ({
							...params,
							page: active + 1,
						}))
						setPage(active + 1)
					}}
					className="grid size-8 cursor-pointer place-items-center rounded-md border border-[#E8E8E9] transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50">
					<ChevronRight className="size-6 text-[#999999]" />
				</button>
			</div>
		</div>
	)
}
