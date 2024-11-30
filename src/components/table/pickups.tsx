import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PAGE_LIMIT, pickupsStatusClass } from "@/config"
import { capitalize, getInitials, getTimeFromNow } from "@/lib"
import { GetPickupsQuery } from "@/queries/purchaser"
import type { PickupsProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
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
		header: "Seller",
		accessorKey: "vendor_contact",
		cell: ({ row }) => (
			<p className="capitalize">
				{row.original.vendor_contact.first_name} {row.original.vendor_contact.last_name}
			</p>
		),
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

					{/* <button
						type="button"
						className="flex w-full rounded-md px-4 py-2 text-xs text-red-600 transition-all hover:bg-red-600 hover:text-white">
						Cancel order
					</button> */}
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

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () => GetPickupsQuery({ page, limit: PAGE_LIMIT, search: "", status: selected_status }),
		queryKey: ["get-purchasers", page, "", selected_status],
		placeholderData: keepPreviousData,
	})
	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<DataTable
			columns={columns}
			data={data?.data.data || []}
			totalPages={totalPages}
			isPlaceholderData={isPlaceholderData}
			isLoading={isPending}
		/>
	)
}
