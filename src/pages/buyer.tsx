import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

const Buyer = () => {
	const navigate = useNavigate()

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Buyer's Details</p>
				<div className="flex items-center gap-6">
					<Button onClick={() => navigate(-1)} variant="outline">
						Back
					</Button>
					<Button>Block buyer</Button>
				</div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14"></div>
		</div>
	)
}

export default Buyer
