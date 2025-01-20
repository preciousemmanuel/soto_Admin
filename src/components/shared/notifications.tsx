import { PAGE_LIMIT } from "@/config"
import { getTimeFromNow } from "@/lib"
import { GetNotificationsQuery, UpdateNotificationMutation } from "@/queries/notifications"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Notification } from "iconsax-react"
import { CheckCheck } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Spinner } from "./spinner"

const tabs = ["unread", "read"]

const page = 1
export const Notifications = () => {
	const queryClient = useQueryClient()
	const [tab, setTab] = React.useState(tabs[0])

	const { data, isPending } = useQuery({
		queryFn: () =>
			GetNotificationsQuery({
				page,
				limit: PAGE_LIMIT,
				type: tab.toUpperCase(),
			}),
		queryKey: ["get-notifications", page, tab],
		placeholderData: keepPreviousData,
	})

	const { isPending: markAsReadLoading, mutate } = useMutation({
		mutationFn: (id: string) => UpdateNotificationMutation(id),
		mutationKey: ["mark-notification-as-read"],
		onSuccess: () => {
			toast.success("Notification marked as read")
			queryClient.invalidateQueries({
				queryKey: ["get-notifications", page, tab],
			})
		},
	})

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="relative grid size-10 place-items-center">
					<Notification />

					{data?.data.data.length ? (
						<span className="absolute right-1 top-0 grid size-5 place-items-center rounded-full bg-red-600 text-xs text-white">
							{data.data.pagination.totalCount}
						</span>
					) : null}
				</button>
			</PopoverTrigger>

			<PopoverContent className="max-h-[500px] w-96 overflow-y-auto text-xs">
				<header className="flex flex-row items-center justify-between gap-2 p-4 pb-2">
					<h2 className="font-body text-lg font-medium">Notifications</h2>
					{/* <button>Clear all</button> */}
				</header>

				<Tabs defaultValue={tabs[0]} value={tab} onValueChange={setTab}>
					<TabsList>
						{tabs.map((tab) => (
							<TabsTrigger key={tab} value={tab} className="capitalize">
								{tab}
							</TabsTrigger>
						))}
					</TabsList>

					{tabs.map((tab) => (
						<TabsContent asChild key={tab} value={tab} className="pt-0">
							<ul>
								{isPending ? (
									<Spinner />
								) : data?.data.data.length ? (
									data.data.data.map((item) => (
										<li
											key={item._id}
											className="grid grid-cols-[1fr_30px] items-start gap-6 border-b border-b-neutral-200 p-4 first-of-type:pt-2 last-of-type:border-b-0">
											<div>
												<h4 className="text-sm font-medium capitalize text-[#1A1A1A]">{item.title}</h4>

												<p className="pt-2 font-body font-normal leading-relaxed text-neutral-500">
													{item.content}
												</p>
												<p className="pt-0.5 text-[10px] text-neutral-400">{getTimeFromNow(item.createdAt)}</p>
											</div>

											{!item.is_read ? (
												<button
													onClick={() => mutate(item._id)}
													title="Mark as read"
													type="button"
													disabled={markAsReadLoading}
													className="grid place-items-center rounded bg-green-50 p-2 text-sm text-green-600 transition-colors hover:bg-green-200 disabled:opacity-50">
													{markAsReadLoading ? <Spinner /> : <CheckCheck size={16} />}
												</button>
											) : null}
										</li>
									))
								) : (
									<li className="text-center text-xs">No {tab.toUpperCase()} notifications found</li>
								)}
							</ul>
						</TabsContent>
					))}
				</Tabs>

				<PopoverArrow />
			</PopoverContent>
		</Popover>
	)
}
