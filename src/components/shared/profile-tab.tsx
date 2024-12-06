import { PAGE_LIMIT } from "@/config"
import { getInitials } from "@/lib"
import { GetAdminsQuery } from "@/queries/admin"
import { GetProfileQuery, UpdateProfileMutation } from "@/queries/profile"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import { Edit } from "iconsax-react"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Spinner } from "./spinner"

type Payload = {
	first_name: string
	last_name: string
	phone_number: string
	password: string
}

export const ProfileTab = () => {
	const [edit, setEdit] = React.useState(false)
	const queryClient = useQueryClient()

	const { data, isPending } = useQuery({
		queryFn: GetProfileQuery,
		queryKey: ["get-profile"],
	})

	const { data: admins } = useQuery({
		queryFn: () => GetAdminsQuery({ page: 1, limit: PAGE_LIMIT }),
		queryKey: ["get-admins"],
	})
	const full_name = `${data?.data.FirstName} ${data?.data.LastName}`

	const { isPending: mutationLoading, mutate } = useMutation({
		mutationFn: (values: Payload) => UpdateProfileMutation(values),
		mutationKey: ["update-profile"],
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-profile"],
			})
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const { handleSubmit, errors, handleChange } = useFormik({
		initialValues: {
			first_name: data?.data.FirstName || "",
			last_name: data?.data.LastName || "",
			email: data?.data.Email || "",
			phone_number: data?.data.PhoneNumber || "",
			password: "",
			confirm_password: "",
		},
		// validationSchema: updateCouponSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { confirm_password, ...rest } = values
			mutate(rest)
		},
	})

	return (
		<>
			{isPending ? (
				<div className="flex items-center justify-center">
					<Spinner variant="primary" size="lg" />
				</div>
			) : (
				<>
					<div className="grid grid-cols-6 gap-6">
						<form
							onSubmit={handleSubmit}
							className="col-span-4 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<div className="flex items-center gap-4 rounded-lg border border-[#E1E7EC] bg-white p-4">
								<Avatar className="size-16">
									<AvatarImage src="" alt="" />
									<AvatarFallback className="bg-[#FFE8E3] text-primary">
										{getInitials(full_name)}
									</AvatarFallback>
								</Avatar>

								<div>
									<p className="font-bold capitalize text-[#1E1E1E]">{full_name}</p>
									<p className="text-sm uppercase">{data?.data.Role.name}</p>
								</div>
							</div>

							<div className="flex flex-col gap-6 rounded-lg border border-[#E1E7EC] bg-white p-4">
								<button
									onClick={() => setEdit(!edit)}
									type="button"
									className="flex w-fit items-center gap-2 self-end rounded-full border border-[#AFAFB0] px-3 py-1 text-sm text-[#8F9499] transition-colors hover:bg-neutral-50">
									<span>Edit</span>
									<Edit className="size-4" />
								</button>

								<div className="grid grid-cols-2 gap-8">
									<Input
										type="text"
										name="first_name"
										label="First Name"
										onChange={handleChange}
										defaultValue={data?.data.FirstName || ""}
										error={errors.first_name}
										disabled={!edit}
									/>
									<Input
										type="text"
										name="last_name"
										label="Last Name"
										onChange={handleChange}
										defaultValue={data?.data.LastName || ""}
										error={errors.last_name}
										disabled={!edit}
									/>
									<Input
										type="email"
										name="email"
										label="Email address"
										onChange={handleChange}
										defaultValue={data?.data.Email || ""}
										error={errors.email}
										disabled
									/>
									<Input
										type="text"
										name="phone_number"
										label="Phone number"
										onChange={handleChange}
										defaultValue={data?.data.PhoneNumber || ""}
										error={errors.phone_number}
										disabled={!edit}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-6 rounded-lg border border-[#E1E7EC] bg-white p-4">
								<div className="grid grid-cols-2 gap-8">
									<Input
										type="password"
										name="password"
										label="Password"
										onChange={handleChange}
										error={errors.password}
										disabled={!edit}
									/>
									<Input
										type="password"
										name="confirm_password"
										label="Confirm Password"
										onChange={handleChange}
										error={errors.confirm_password}
										disabled={!edit}
									/>
								</div>

								{edit && (
									<Button type="submit" disabled={mutationLoading}>
										{mutationLoading ? <Spinner /> : "Save Changes"}
									</Button>
								)}
							</div>
						</form>

						<div className="col-span-2 flex flex-col gap-8 rounded-xl border-0.5 border-[#f8f3f3] bg-white p-6 shadow-card shadow-primary/[8%]">
							<div className="border-b border-b-[#D7D7D7] pb-4 text-sm">
								<p className="font-medium">Admin List</p>
								<p className="text-sm text-[#666666]">{admins?.data.pagination.totalCount} admins</p>
							</div>

							<ul className="flex flex-col gap-4">
								{admins?.data.data.length ? (
									admins.data.data.map((admin) => {
										const adminFullname = `${admin.FirstName} ${admin.LastName}`

										return (
											<li className="flex items-center gap-6 text-xs" key={admin._id}>
												<Avatar className="size-10">
													<AvatarImage src={admin.ProfileImage} alt={adminFullname} />
													<AvatarFallback>{getInitials(adminFullname)}</AvatarFallback>
												</Avatar>

												<div className="flex-1 capitalize">
													<p className="font-medium">{adminFullname}</p>
													<p className="text-[#979797]">{admin.Role.name}</p>
												</div>

												{/* <p className="rounded-full bg-gray-200 px-3 py-1">Active</p> */}
											</li>
										)
									})
								) : (
									<li>No admin(s) found.</li>
								)}
							</ul>
						</div>
					</div>
				</>
			)}
		</>
	)
}
