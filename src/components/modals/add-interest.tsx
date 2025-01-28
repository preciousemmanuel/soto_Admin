import { GetSettingsQuery, UpdateSettingsMutation } from "@/queries/settings"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as React from "react"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Slider } from "../ui/slider"

const rates = [0, 5, 10, 15, 20, 25]

export const AddInterestModal = () => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()
	const { data } = useQuery({
		queryFn: GetSettingsQuery,
		queryKey: ["get-settings"],
	})

	const rate = data?.data?.interest_rates ? data?.data?.interest_rates.flat : 0
	const defaultRate = data?.data?.interest_rates ? data?.data?.interest_rates.flat : 0
	const [flatRate, setFlatRate] = React.useState([rate])
	const [interestRate, setInterestRate] = React.useState([defaultRate])

	const { isPending, mutate } = useMutation({
		mutationFn: () =>
			UpdateSettingsMutation({
				interest_rates_flat: flatRate[0],
				interest_rates_special: interestRate[0],
			}),
		mutationKey: ["update-settings"],
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-settings"],
			})
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="border-primary hover:bg-primary/5">
					Add interest
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Set up Interest Rate</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-16 text-[#666666]">
					<div className="flex flex-col gap-4">
						<p className="text-sm">Flat rate across all products</p>
						<div className="flex flex-col gap-4">
							<ul className="grid grid-cols-6 gap-10 text-sm font-bold">
								{rates.map((rate) => (
									<li
										key={rate}
										className={`${flatRate.at(0) === rate ? "text-primary" : "text-[rgba(235,0,27,0.2)]"}`}>
										{rate}%
									</li>
								))}
							</ul>

							<div className="flex flex-col gap-2">
								<Slider value={flatRate} onValueChange={setFlatRate} min={0} max={25} step={1} />
								<p className="self-end rounded-md bg-neutral-200 px-4 py-1 text-sm">
									Flat rate: <strong>{flatRate.at(0)}%</strong>
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<p className="text-sm">Interest rate on products above 1,000,000 naira</p>
						<div className="flex flex-col gap-4">
							<ul className="grid grid-cols-6 gap-10 text-sm font-bold">
								{rates.map((rate) => (
									<li
										key={rate}
										className={`${interestRate.at(0) === rate ? "text-primary" : "text-[rgba(235,0,27,0.2)]"}`}>
										{rate}%
									</li>
								))}
							</ul>
							<div className="flex flex-col gap-2">
								<Slider value={interestRate} onValueChange={setInterestRate} min={0} max={25} step={1} />
								<p className="self-end rounded-md bg-neutral-200 px-4 py-1 text-sm">
									Interest rate: <strong>{interestRate.at(0)}%</strong>
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Button disabled={isPending} onClick={() => mutate()}>
							{isPending ? <Spinner /> : "Update"}
						</Button>
						<Button variant="ghost">Cancel</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
