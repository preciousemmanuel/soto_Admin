import { AddPurchaserModal } from "@/components/modals"
import { DataTable } from "@/components/shared"
import { PickupsTable } from "@/components/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PAGE_LIMIT } from "@/config"
import { useDebounce, usePageTitle } from "@/hooks"
import { getInitials, replaceSpaceWithUnderscore } from "@/lib"
import { GetPurchasersQuery } from "@/queries/purchaser"
import type { PurchasersProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { SearchNormal1 } from "iconsax-react"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"

// PENDING | CANCELLED DELIVERED PICKED_UP/

const tabs = ["purchasers", "pending", "picked up", "delivered", "cancelled"] as const
// type Tabs = (typeof tabs)[number]

type PurchaserDetails = PurchasersProps["data"][number]
const columns: ColumnDef<PurchaserDetails>[] = [
	{
		header: "ID",
		accessorKey: "_id",
		cell: ({ row }) => row.original?.UniqueId ?? row.original._id,
	},
	{
		header: "Purchaser",
		accessorKey: "FirstName",
		cell: ({ row }) => (
			<div className="flex items-center gap-2.5">
				<Avatar className="size-9">
					<AvatarImage src="" alt={row.getValue("FirstName")} />
					<AvatarFallback>{getInitials(row.getValue("FirstName"))}</AvatarFallback>
				</Avatar>

				<p className="font-medium capitalize leading-none">
					{row.original.FirstName} {row.original.LastName}
				</p>
			</div>
		),
	},
	{
		header: "Email",
		accessorKey: "Email",
	},
	{
		header: "Phone number",
		accessorKey: "PhoneNumber",
	},
	{
		header: "Location",
		accessorKey: "address_details.full_address",
	},
	{
		header: "Joined Date",
		accessorKey: "createdAt",
		cell: ({ row }) => format(new Date(row.getValue("createdAt")), "d MMM, yyyy hh:mm a"),
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
						to={`/dashboard/purchasers/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View purchaser
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

const Purchasers = () => {
	usePageTitle("Purchasers")
	const [searchParams, setSearchParams] = useSearchParams()
	const page = Number(searchParams.get("page")) || 1
	const status = searchParams.get("status") ?? tabs[0]

	const [query, setQuery] = React.useState("")
	const purchaser_name = useDebounce(query, 500)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () => GetPurchasersQuery({ page, limit: PAGE_LIMIT, search: purchaser_name }),
		queryKey: ["get-purchasers", page, purchaser_name],
		placeholderData: keepPreviousData,
	})
	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Purchaser Management</h2>

				{/* <Button className="w-36" asChild>
					<Link to="/dashboard/purchasers/new">Add Purchaser</Link>
				</Button> */}
				<AddPurchaserModal />
			</header>

			<Tabs
				defaultValue={replaceSpaceWithUnderscore(status) ?? tabs[0]}
				value={replaceSpaceWithUnderscore(status) ?? tabs[0]}
				onValueChange={(value) => {
					searchParams.set("status", replaceSpaceWithUnderscore(value))
					setSearchParams(searchParams)
				}}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger key={tab} value={replaceSpaceWithUnderscore(tab)}>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				{tabs.map((tab) => (
					<TabsContent key={tab} value={replaceSpaceWithUnderscore(tab)}>
						{tab === "purchasers" ? (
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
						) : (
							<PickupsTable />
						)}
					</TabsContent>
				))}
			</Tabs>

			{/* {isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<DataTable
					columns={columns}
					data={data?.data.data || []}
					totalPages={totalPages}
					isPlaceholderData={isPlaceholderData}
				/>
			)} */}
		</section>
	)
}

export default Purchasers
