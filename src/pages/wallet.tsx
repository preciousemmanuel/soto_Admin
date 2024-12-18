import { DataTable, Spinner, WalletCard } from "@/components/shared"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { frequencyFilter, PAGE_LIMIT, transactionStatusClass } from "@/config"
import { usePageTitle } from "@/hooks"
import { formatCurrency } from "@/lib"
import { GetWalletOverviewQuery } from "@/queries"
import type { TimelineProps, WalletOverviewProps } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"

const typeClass = {
	ORDER: "text-green-600",
	WITHDRAWAL: "text-red-600",
}
type Transactions = WalletOverviewProps["transaction_logs"]["data"][number]

const columns: ColumnDef<Transactions>[] = [
	{
		header: "Trx ID",
		accessorKey: "reference",
	},
	{
		header: "User",
		accessorKey: "user",
		cell: ({ row }) =>
			row.original.user ? (
				<div>
					<p className="font-medium capitalize">
						{row.original.user.FirstName} {row.original.user.LastName}
					</p>
					<p className="text-xs">{row.original.user.UserType}</p>
				</div>
			) : (
				<p>N/A</p>
			),
	},
	{
		header: () => <p className="text-right">Amount</p>,
		accessorKey: "amount",
		cell: ({ row }) => (
			<p
				className={`text-right font-medium ${typeClass[row.getValue("narration") as keyof typeof typeClass]}`}>
				{row.getValue("narration") === "ORDER" ? "+" : "-"}
				{formatCurrency(row.getValue("amount"))}
			</p>
		),
	},
	{
		header: "Narration",
		accessorKey: "narration",
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
		header: "Type",
		accessorKey: "type",
		// cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
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
]

const Wallet = () => {
	usePageTitle("Wallet")
	const [timeLine, setTimeLine] = React.useState<TimelineProps>("")

	const [searchParams] = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const { data, isPending, isPlaceholderData } = useQuery({
		queryFn: () => GetWalletOverviewQuery({ page, limit: PAGE_LIMIT, timeLine }),
		queryKey: ["get-wallet", page, timeLine],
		placeholderData: keepPreviousData,
	})
	const totalPages = Number(data?.data.transaction_logs.pagination.pageCount)
	// const total = Number(data?.data.transaction_logs.pagination.totalCount)

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Wallet</h2>

				<div className="flex items-center gap-6">
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

					<Button asChild>
						<Link to="/dashboard/wallet/withdrawal-requests">Withdrawal Requests</Link>
					</Button>
				</div>
			</header>

			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<>
					<div className="grid w-full grid-cols-4 gap-5">
						<WalletCard
							label="transaction amount"
							color="primary"
							amount={data?.data.transaction.amount}
							percentage_change={data?.data.transaction.percentage_change}
						/>
						<WalletCard
							label="total income"
							color="green"
							amount={data?.data.income.amount}
							percentage_change={data?.data.income.percentage_change}
						/>
						<WalletCard
							label="total withdraw"
							color="yellow"
							amount={data?.data.withdrawal.amount}
							percentage_change={data?.data.withdrawal.percentage_change}
						/>
						<WalletCard
							label="remittance balance"
							color="red"
							amount={data?.data.remittance.amount}
							percentage_change={data?.data.remittance.percentage_change}
						/>
					</div>

					<div className="flex flex-col gap-8 border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
						<div className="flex w-full items-center justify-between">
							<p className="text-xl">Transactions</p>

							{/* <Link to="" className="flex items-center gap-3 text-sm font-medium text-primary">
						More <ArrowRight size={16} />
					</Link> */}
						</div>

						<DataTable
							columns={columns}
							data={data?.data.transaction_logs.data || []}
							totalPages={totalPages}
							isPlaceholderData={isPlaceholderData}
						/>
					</div>
				</>
			)}
		</section>
	)
}

export default Wallet
