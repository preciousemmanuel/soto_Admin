import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { GetAdminQuery } from "@/queries/admin"
import { usePageTitle } from "@/hooks"
import { capitalize } from "@/lib"

const Admin = () => {
	const { id } = useParams()

	const { data: admin } = useQuery({
		queryFn: () => GetAdminQuery(String(id)),
		queryKey: ["get-admin", id],
		enabled: !!id,
	})

	usePageTitle(`${capitalize(`${admin?.data.FirstName} ${admin?.data.LastName}`)}`)

	return (
		<div>
			<div className="flex w-full items-center justify-between pb-[27px] pt-[72px]">
				<p className="text-[32px] font-medium">Admin</p>
				<div className="flex items-center gap-6"></div>
			</div>
			<div className="my-5 flex w-full flex-col gap-14"></div>
		</div>
	)
}

export default Admin
