import { DataTable } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PAGE_LIMIT, transactionStatusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { GetWithdrawalRequestsQuery } from "@/queries"
import type { WithdrawalRequestsProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useNavigate, useSearchParams } from "react-router-dom"

const tabs = ["pending", "successful", "failed", "reversal"]
type Requests = WithdrawalRequestsProps["data"][number]
const columns: ColumnDef<Requests>[] = [
	{
		header: "Seller name",
		accessorKey: "vendor_name",
		cell: ({ row }) => <p className="capitalize">{row.getValue("vendor_name")}</p>,
	},
	{
		header: "Account",
		accessorKey: "amount",
		cell: ({ row }) => (
			<div>
				<p>{row.original.account_name}</p>
				<p className="text-xs text-gray-400">
					{row.original.account_number} - {row.original.bank}
				</p>
			</div>
		),
	},
	{
		header: "Date",
		accessorKey: "createdAt",
		cell: ({ row }) => (
			<>
				<p>{format(new Date(row.getValue("createdAt")), "d MMM, yyyy")}</p>
				<p className="text-xs">{format(new Date(row.getValue("createdAt")), "h:mm a")}</p>
			</>
		),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<p
				className={`capitalize ${transactionStatusClass[row.getValue("status") as keyof typeof transactionStatusClass]}`}>
				{row.getValue("status")}
			</p>
		),
	},
	{
		header: "Action",
		// accessorKey: "grand_total",
		cell: ({ row }) => (
			<div className="flex items-center gap-2 text-xs">
				<button
					type="button"
					disabled={row.getValue("status") === "FAILED"}
					className={`rounded-md px-3 py-1.5 pb-2 leading-none text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[#E5E5E5] disabled:text-[#BDBDBD] ${row.getValue("status") === "SUCCESSFUL" ? "cursor-not-allowed bg-[#6DC98D]" : "bg-[#0CAD44]"}`}>
					Approve
				</button>
				<button
					type="button"
					disabled={row.getValue("status") === "SUCCESSFUL"}
					className={`rounded-md px-3 py-1.5 pb-2 leading-none text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[#E5E5E5] disabled:text-[#BDBDBD] ${row.getValue("status") === "FAILED" ? "cursor-not-allowed bg-[#FB6164]" : "bg-[bg-[#FC1317]]"}`}>
					Decline
				</button>
			</div>
		),
	},
]

const WithdrawalRequests = () => {
	usePageTitle("Withdrawal Requests")
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const status = searchParams.get("status") || "pending"
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () =>
			GetWithdrawalRequestsQuery({ page, limit: PAGE_LIMIT, status: status.toUpperCase() }),
		queryKey: ["get-withdrawal-requests", page, status],
		placeholderData: keepPreviousData,
	})
	const totalPages = Number(data?.data.pagination.pageCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Withdrawal Requests</h2>

				<div className="flex items-center gap-6">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Back
					</Button>
				</div>
			</header>

			<Tabs
				defaultValue={status}
				value={status}
				onValueChange={(value) => {
					searchParams.set("status", value)
					setSearchParams(searchParams)
				}}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger key={tab} value={tab}>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				{tabs.map((tab) => (
					<TabsContent key={tab} value={tab}>
						<DataTable
							columns={columns}
							data={data?.data.data || []}
							totalPages={totalPages}
							isLoading={isPending}
							isPlaceholderData={isPlaceholderData}
						/>
					</TabsContent>
				))}
			</Tabs>
		</section>
	)
}

export default WithdrawalRequests
