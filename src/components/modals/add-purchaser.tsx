import { PAGE_LIMIT, STATES } from "@/config"
import { CreateAdminMutation } from "@/queries/admin"
import { GetRolesQuery } from "@/queries/settings"
import { addAdminSchema, addPurchaserSchema } from "@/schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
import * as Yup from "yup"
import { Spinner } from "../shared"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const initialValues = {
	first_name: "",
	last_name: "",
	email: "",
	phone_number: "",
	address: "",
	city: "",
	postal_code: "",
	state: "",
}

type Payload = Yup.InferType<typeof addAdminSchema>

export const AddPurchaserModal = () => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { data: roles } = useQuery({
		queryFn: () => GetRolesQuery({ page: 1, limit: PAGE_LIMIT }),
		queryKey: ["get-roles", 1],
	})

	const { isPending, mutate } = useMutation({
		mutationFn: (values: Payload) => CreateAdminMutation(values),
		mutationKey: ["add-purchaser"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			setOpen(false)
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const { handleSubmit, errors, handleChange } = useFormik({
		initialValues,
		validationSchema: addPurchaserSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			mutate({
				...values,
				role: String(roles?.data.data.find((role) => role.name.toLowerCase() === "purchaser")?._id),
				country: "Nigeria",
			})
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add Purchaser</Button>
			</DialogTrigger>

			<DialogContent className="max-w-2xl">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Add Purchaser</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 py-4">
					<Input
						type="text"
						name="first_name"
						label="First Name"
						onChange={handleChange}
						error={errors.first_name}
					/>
					<Input
						type="text"
						name="last_name"
						label="Last Name"
						onChange={handleChange}
						error={errors.last_name}
					/>
					<Input type="email" name="email" label="Email" onChange={handleChange} error={errors.email} />
					<Input
						type="text"
						name="phone_number"
						label="Phone number"
						onChange={handleChange}
						error={errors.phone_number}
					/>

					<Input
						type="text"
						name="address"
						label="Address"
						onChange={handleChange}
						error={errors.address}
					/>
					<Input
						type="text"
						name="postal_code"
						label="Postal Code"
						onChange={handleChange}
						error={errors.postal_code}
					/>
					<Input type="text" name="city" label="City" onChange={handleChange} error={errors.city} />

					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							State
						</p>
						<Select
							name="state"
							onValueChange={(value) => handleChange({ target: { name: "state", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder="Select a value" />
							</SelectTrigger>

							<SelectContent>
								{STATES.map((state) => (
									<SelectItem key={state} value={state} className="capitalize">
										{state}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
					</label>

					<Button type="submit" disabled={isPending} className="col-span-full">
						{isPending ? <Spinner /> : "Add Purchaser"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
