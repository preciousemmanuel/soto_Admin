import { UpdateDisputeModal } from "@/components/modals/update-dispute"
import { DataTable, Spinner } from "@/components/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PAGE_LIMIT } from "@/config"
import { usePageTitle } from "@/hooks"
import { capitalize, getInitials } from "@/lib"
import { GetDisputesQuery } from "@/queries/dispute"
import type { DisputesProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

const tabs = ["resolved", "pending", "cancelled"]

const statusClass = {
	RESOLVED: "text-green-600",
	CANCELLED: "text-red-600",
	PENDING: "text-yellow-600",
}

type DisputeDetails = DisputesProps["data"][number]
const columns: ColumnDef<DisputeDetails>[] = [
	{
		header: "Dispute ID",
		accessorKey: "_id",
		cell: ({ row }) => <p>#{row.original._id.substring(0, 8)}</p>,
	},

	{
		header: "Tracking ID",
		accessorKey: "code",
	},
	{
		header: "Created By",
		accessorKey: "user.FirstName",
		cell: ({ row }) => {
			const fullname = row.original.user
				? `${row.original.user.FirstName} ${row.original.user.LastName}`
				: "Anonymous"
			return (
				<div className="flex items-center gap-2.5">
					<Avatar className="size-9">
						<AvatarImage src="" alt={fullname} />
						<AvatarFallback>{getInitials(fullname)}</AvatarFallback>
					</Avatar>

					<p className="font-medium capitalize leading-none">{fullname}</p>
				</div>
			)
		},
	},
	{
		header: "Title",
		accessorKey: "title",
		cell: ({ row }) => <p className="max-w-52 truncate">{capitalize(row.getValue("title"))}</p>,
	},
	// {
	// 	header: "Description",
	// 	accessorKey: "description",
	// 	cell: ({ row }) => <p className="w-72 truncate">{capitalize(row.getValue("description"))}</p>,
	// },
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<span
				className={`text-sm font-medium uppercase ${statusClass[row.getValue("status") as keyof typeof statusClass]}`}>
				{capitalize(row.getValue("status"))}
			</span>
		),
	},
	{
		header: "Date",
		accessorKey: "createdAt",
		cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
	},
	{
		header: "Action",
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger>
					<MoreHorizontal />
				</PopoverTrigger>

				<PopoverContent>
					<UpdateDisputeModal id={row.original._id} />

					<Link
						to={`/dashboard/disputes/${row.original._id}`}
						className="flex rounded-md px-4 py-2 text-xs transition-all hover:bg-primary hover:text-white">
						View Dispute
					</Link>
				</PopoverContent>
			</Popover>
		),
	},
]

const Disputes = () => {
	usePageTitle("Products")
	// const [timeLine, setTimeLine] = React.useState<TimelineProps>("")
	const [searchParams, setSearchParams] = useSearchParams()

	const status = searchParams.get("status") ?? tabs[0]
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () => GetDisputesQuery({ page, limit: PAGE_LIMIT, status: status.toUpperCase() }),
		queryKey: ["get-disputes", page, status],
		placeholderData: keepPreviousData,
	})
	// const totalPages = Number(data?.data.data.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="text-3xl font-medium">Dispute Resolution</h2>

				{/* <div className="flex items-center gap-3">
					<Select value={timeLine} onValueChange={setTimeLine}>
						<SelectTrigger className="w-[166px]">
							<SelectValue placeholder="Select Range" />
						</SelectTrigger>
						<SelectContent>
							{frequencyFilter.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div> */}
			</header>

			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<>
					<div className="grid grid-cols-4 gap-4">
						<div className="flex w-full flex-col gap-1.5 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="text-xs font-medium text-[#6B6B6B]">Total Received</p>
							<p className="text-2xl font-semibold">{data?.data.metrics[0].total_disputes}</p>
						</div>
						<div className="flex w-full flex-col gap-1.5 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="text-xs font-medium text-[#6B6B6B]">Resolved Disputes</p>
							<p className="text-2xl font-semibold">{data?.data.metrics[0].total_resolved}</p>
						</div>
						<div className="flex w-full flex-col gap-1.5 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="text-xs font-medium text-[#6B6B6B]">Pending Disputes</p>
							<p className="text-2xl font-semibold">{data?.data.metrics[0].total_pending}</p>
						</div>
						<div className="flex w-full flex-col gap-1.5 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<p className="text-xs font-medium text-[#6B6B6B]">Cancelled Disputes</p>
							<p className="text-2xl font-semibold">
								{Number(data?.data.metrics[0].total_disputes ?? 0) -
									(Number(data?.data.metrics[0].total_pending ?? 0) +
										Number(data?.data.metrics[0].total_resolved ?? 0))}
							</p>
						</div>
					</div>

					<Tabs
						defaultValue={status ?? tabs[0]}
						value={status ?? tabs[0]}
						onValueChange={(value) => {
							searchParams.set("status", value)
							setSearchParams(searchParams)
						}}>
						<TabsList>
							{tabs.map((tab) => (
								<TabsTrigger key={tab} value={tab}>
									{tab} disputes
								</TabsTrigger>
							))}
						</TabsList>

						{tabs.map((tab) => (
							<TabsContent key={tab} value={tab}>
								<DataTable
									columns={columns}
									data={data?.data.data || []}
									totalPages={1}
									isPlaceholderData={isPlaceholderData}
								/>
							</TabsContent>
						))}
					</Tabs>
				</>
			)}
		</section>
	)
}

export default Disputes
