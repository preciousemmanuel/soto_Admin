import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PAGE_LIMIT } from "@/config"
import { GetRolesQuery } from "@/queries/settings"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { CreateRoleModal, UpdateRoleModal } from "../modals"
import { Pagination } from "../ui/pagination"
import { Spinner } from "./spinner"

export const RolesPermissionsTab = () => {
	const [searchParams] = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending } = useQuery({
		queryFn: () =>
			GetRolesQuery({
				limit: PAGE_LIMIT,
				page,
			}),
		queryKey: ["get-sellers", page],
		placeholderData: keepPreviousData,
	})

	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<div className="flex flex-col gap-4">
			<header className="flex items-center justify-end border-b border-b-neutral-200 pb-4">
				<CreateRoleModal />
			</header>

			<div className="w-full">
				<ul className="grid grid-cols-3 gap-4 py-2">
					{isPending ? (
						<li className="col-span-full place-self-center">
							<Spinner variant="primary" size="lg" />
						</li>
					) : data?.data.data.length ? (
						data.data.data.map((role) => (
							<li className="flex w-full flex-col gap-6 rounded-lg border border-[#F0F0F0] bg-[#FCFCFC] p-6 shadow-card shadow-primary/[8%]">
								<div className="flex items-center justify-between gap-1">
									<div>
										<p className="text-[10px] uppercase text-neutral-500">Role Name</p>
										<p className="text-sm capitalize">{role.name}</p>
									</div>

									<Popover>
										<PopoverTrigger asChild>
											<button className="ml-auto grid place-items-center self-start rounded bg-neutral-100 px-2 pt-0.5">
												<MoreHorizontal size={20} />
											</button>
										</PopoverTrigger>

										<PopoverContent>
											<UpdateRoleModal data={role} />
											{/* <button
												type="button"
												className="flex w-full rounded-md px-4 py-2 text-xs transition-all hover:bg-red-600 hover:text-white">
												Delete Role
											</button> */}
										</PopoverContent>
									</Popover>
								</div>

								<div className="flex flex-col gap-4 rounded-md bg-neutral-100 p-4 text-xs text-neutral-500">
									<div className="grid grid-cols-[1fr_50px_50px] gap-2 text-xs uppercase text-neutral-800">
										<p>Permissions</p>
										<p className="text-center">Read</p>
										<p className="text-center">Write</p>
									</div>

									<div className="grid grid-cols-[1fr_50px_50px] gap-2">
										<p>Admin</p>
										<p className="text-center font-medium text-neutral-600">{role.admin.read}</p>
										<p className="text-center font-medium text-neutral-600">{role.admin.write}</p>
									</div>

									<div className="grid grid-cols-[1fr_50px_50px] gap-2">
										<p>Config</p>
										<p className="text-center font-medium text-neutral-600">{role.config.read}</p>
										<p className="text-center font-medium text-neutral-600">{role.config.write}</p>
									</div>

									<div className="grid grid-cols-[1fr_50px_50px] gap-2">
										<p>Buyer</p>
										<p className="text-center font-medium text-neutral-600">{role.buyer.read}</p>
										<p className="text-center font-medium text-neutral-600">{role.buyer.write}</p>
									</div>

									<div className="grid grid-cols-[1fr_50px_50px] gap-2">
										<p>Seller</p>
										<p className="text-center font-medium text-neutral-600">{role.seller.read}</p>
										<p className="text-center font-medium text-neutral-600">{role.seller.write}</p>
									</div>

									<div className="grid grid-cols-[1fr_50px_50px] gap-2">
										<p>Product</p>
										<p className="text-center font-medium text-neutral-600">{role.product.read}</p>
										<p className="text-center font-medium text-neutral-600">{role.product.write}</p>
									</div>

									<div className="grid grid-cols-[1fr_50px_50px] gap-2">
										<p>Product</p>
										<p className="text-center font-medium text-neutral-600">{role.product.read}</p>
										<p className="text-center font-medium text-neutral-600">{role.product.write}</p>
									</div>
								</div>
							</li>
						))
					) : (
						<li className="col-span-full text-center">No role(s) found.</li>
					)}
				</ul>

				{data && totalPages ? <Pagination totalPages={totalPages} /> : null}
			</div>
		</div>
	)
}
