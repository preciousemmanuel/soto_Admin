import * as React from "react"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"

export const WithdrawalTab = () => {
	// const { data } = useQuery({
	// 	queryFn: GetSettingsQuery,
	// 	queryKey: ["get-settings"],
	// })

	const [field, setField] = React.useState({
		manual: false,
		scheduled: false,
		frequency: undefined,
	})

	return (
		<form className="col-span-4 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
			<div className="border-b border-b-[#E0E0E0] p-4">
				<p className="text-xl font-bold text-[#25252D]">Withdraw Options</p>
				<p className="text-sm text-[#828282]">Choose between automatic and manual withdraw method.</p>
			</div>

			<div className="flex items-center justify-between gap-4 rounded-lg border border-[#E1E7EC] bg-white p-4">
				<div>
					<p className="text-base">
						Seller can request for withdrawal <strong>Manually</strong>
					</p>
					<p className="text-sm text-[#828282]">
						Withdrawal requests are processed manually upon receiving one.
					</p>
				</div>

				<Switch
					checked={field.manual}
					onCheckedChange={(value) => setField({ ...field, manual: value })}
				/>
			</div>

			<div className="flex items-center justify-between gap-4 rounded-lg border border-[#E1E7EC] bg-white p-4">
				<div>
					<p className="text-base">
						<strong>Automatically</strong> process withdrawals based on schedules
					</p>
					<p className="text-sm text-[#828282]">
						Withdrawals are automated on scheduled timing (24hrs).
					</p>
				</div>

				<Switch
					checked={field.scheduled}
					onCheckedChange={(value) => setField({ ...field, scheduled: value })}
				/>
			</div>

			<div className="flex flex-col gap-6 rounded-lg border border-[#E1E7EC] bg-white p-4">
				<div>
					<p className="text-base">Withdraw Schedule</p>
					<p className="text-sm text-[#828282]">
						Offer seller to schedule withdraws. Configure scheduled withdraws here.
					</p>
				</div>

				<ul className="flex flex-col gap-4 pl-6">
					<li className="flex items-center justify-between gap-4 rounded-lg border border-[#E1E7EC] bg-white p-4">
						<p>Any time</p>
						<Switch name="withdraw" />
					</li>
					<li className="flex items-center justify-between gap-4 rounded-lg border border-[#E1E7EC] bg-white p-4">
						<p>Once a day</p>
						<Switch name="withdraw" />
					</li>
					<li className="flex items-center justify-between gap-4 rounded-lg border border-[#E1E7EC] bg-white p-4">
						<p>Once a week</p>
						<Switch name="withdraw" />
					</li>
				</ul>
			</div>

			<div className="flex items-center justify-end rounded-lg border border-[#E1E7EC] bg-white p-4">
				<Button className="w-32">Save</Button>
			</div>
		</form>
	)
}
