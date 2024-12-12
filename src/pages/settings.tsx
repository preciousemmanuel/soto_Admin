import { AddAdminModal } from "@/components/modals"
import { LogoutModal } from "@/components/modals/logout"
import { Notifications, WithdrawalTab } from "@/components/shared"
import { ProfileTab } from "@/components/shared/profile-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PAGE_LIMIT } from "@/config"
import { usePageTitle } from "@/hooks"
import { GetRolesQuery } from "@/queries/settings"
import { usePrefetchQuery } from "@tanstack/react-query"
import { Message2 } from "iconsax-react"
import { useSearchParams } from "react-router-dom"

const tabs = ["profile", "withdrawal", "feedback"] as const
type Tabs = (typeof tabs)[number]

const Settings = () => {
	usePageTitle("Settings")
	const [searchParams, setSearchParams] = useSearchParams()
	const status = searchParams.get("status")

	usePrefetchQuery({
		queryFn: () => GetRolesQuery({ page: 1, limit: PAGE_LIMIT }),
		queryKey: ["get-roles", 1],
	})

	return (
		<section className="flex flex-col gap-10">
			<header className="flex items-center justify-between gap-2">
				<h2 className="font-body text-3xl font-medium">Account Settings</h2>

				<div className="flex items-center gap-3">
					<button className="relative grid size-10 place-items-center">
						<Message2 />
					</button>

					<Notifications />

					<AddAdminModal />

					<LogoutModal />
				</div>
			</header>

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
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="profile">
					<ProfileTab />
				</TabsContent>

				<TabsContent value="withdrawal">
					<WithdrawalTab />
				</TabsContent>
			</Tabs>
		</section>
	)
}

export default Settings
