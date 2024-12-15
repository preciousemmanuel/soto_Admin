import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PAGE_LIMIT, pickupsStatusClass } from "@/config"
import { useDebounce } from "@/hooks"
import { capitalize, getInitials, getTimeFromNow } from "@/lib"
import { GetPickupsQuery } from "@/queries/purchaser"
import type { PickupsProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { SearchNormal1 } from "iconsax-react"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { UpdatePurchaserOrderStatusModal } from "../modals"
import { DataTable } from "../shared"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type PickupsDetails = PickupsProps["data"][number]
const columns: ColumnDef<PickupsDetails>[] = [
	{
		header: "Order ID",
		accessorKey: "order_id",
		// @ts-expect-error nil
		cell: ({ row }) => <p>#{row.getValue("order_id").substring(0, 8)}</p>,
	},
	{
		header: "Purchaser",
		accessorKey: "purchaser",
		cell: ({ row }) => {
			const full_name = `${row.original.purchaser.first_name} ${row.original.purchaser.last_name}`

			return (
				<div className="flex items-center gap-2.5">
					<Avatar className="size-9">
						<AvatarImage src={row.original.purchaser.profile_image} alt={full_name} />
						<AvatarFallback>{getInitials(full_name)}</AvatarFallback>
					</Avatar>

					<p className="font-medium capitalize leading-none">{full_name}</p>
				</div>
			)
		},
	},
	{
		header: "Assigned",
		accessorKey: "createdAt",
		cell: ({ row }) => getTimeFromNow(row.getValue("createdAt")),
	},
	{
		header: () => <p className="text-center">QTY</p>,
		accessorKey: "quantity",
		cell: ({ row }) => <p className="text-center">{row.getValue("quantity")}</p>,
	},
	{
		header: "Vendor",
		accessorKey: "vendor_contact",
		cell: ({ row }) => <p className="capitalize">{row.original.vendor_contact.first_name}</p>,
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<span
				className={`text-sm capitalize ${pickupsStatusClass[row.getValue("status") as keyof typeof pickupsStatusClass]}`}>
				{capitalize(row.getValue("status"))}
			</span>
		),
	},
	{
		header: "Actions",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>

				<PopoverContent>
					<Link
						to={`/dashboard/purchasers/${row.original.purchaser._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View purchaser
					</Link>

					<Link
						to={`/dashboard/orders/${row.original.order_id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View order
					</Link>

					<UpdatePurchaserOrderStatusModal id={row.original._id} />
				</PopoverContent>
			</Popover>
		),
	},
]

type status = "PENDING" | "CANCELLED" | "PICKED_UP" | "DELIVERED"
export const PickupsTable = () => {
	const [searchParams] = useSearchParams()
	const page = Number(searchParams.get("page")) || 1
	const status = searchParams.get("status") === "purchasers" ? "PENDING" : searchParams.get("status")
	const selected_status = status?.toUpperCase() as status

	const [query, setQuery] = React.useState("")
	const purchaser = useDebounce(query, 500)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () =>
			GetPickupsQuery({ page, limit: PAGE_LIMIT, search: purchaser, status: selected_status }),
		queryKey: ["get-purchasers", page, purchaser, selected_status],
		placeholderData: keepPreviousData,
	})
	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<div className="flex flex-col gap-5">
			<div className="relative flex items-center gap-2 self-end">
				<SearchNormal1 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5F6B7A]" />
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-96 rounded-md border-0 bg-neutral-50 px-3 py-2 pl-12 outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus-visible:ring-primary"
					placeholder="Search by purchasers's name"
				/>
			</div>

			<DataTable
				columns={columns}
				data={data?.data.data || []}
				totalPages={totalPages}
				isPlaceholderData={isPlaceholderData}
				isLoading={isPending}
			/>
		</div>
	)
}
