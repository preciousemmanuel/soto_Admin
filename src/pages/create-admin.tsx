import { usePageTitle } from "@/hooks"

const CreateAdmin = () => {
	usePageTitle("Create Admin")

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">CreateAdmin</p>
				<div className="flex items-center gap-6"></div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14"></div>
		</div>
	)
}

export default CreateAdmin
