import { CreatePurchaserMutation, type CreatePurchaserPayload } from "@/queries/purchaser"
import { GetCitiesQuery, GetStatesQuery } from "@/queries/shared"
import { addPurchaserSchema, idTypes } from "@/schema"
import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as React from "react"
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
	state: "",
	id_type: "",
	id_number: "",
	password: "",
	passport: undefined,
}

export const AddPurchaserModal = () => {
	const [open, setOpen] = React.useState(false)
	const queryClient = useQueryClient()

	const { data: states } = useQuery({
		queryKey: ["get-states"],
		queryFn: GetStatesQuery,
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const { isPending, mutate } = useMutation({
		mutationFn: (values: CreatePurchaserPayload) => CreatePurchaserMutation(values),
		mutationKey: ["add-purchaser"],
		onSuccess: () => {
			queryClient.invalidateQueries()
			setOpen(false)
			// URL.revokeObjectURL(values?.passport as string)
		},
	})

	const { handleSubmit, errors, handleChange, setFieldValue, values } = useFormik({
		initialValues,
		validationSchema: addPurchaserSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			mutate({
				...values,
				country: "Nigeria",
				id_type: values.id_type.replace(" ", "_").toUpperCase(),
			})
		},
	})

	const selectedState = states?.data.find((state) => state.name === values.state)

	const { data: cities, isLoading } = useQuery({
		queryKey: ["get-cities", selectedState?.isoCode],
		queryFn: selectedState?.isoCode
			? () => GetCitiesQuery({ state_code: selectedState?.isoCode })
			: skipToken,
		staleTime: Infinity,
		gcTime: Infinity,
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add Purchaser</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90%] overflow-y-auto">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>Add Purchaser</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-8 py-4">
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
						maxLength={11}
					/>

					<Input
						type="text"
						name="address"
						label="Address"
						onChange={handleChange}
						error={errors.address}
					/>

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
								{states?.data.map((state) => (
									<SelectItem key={state._id} value={state.name} className="capitalize">
										{state.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
					</label>

					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							City
						</p>
						<Select
							name="city"
							disabled={isLoading}
							onValueChange={(value) => handleChange({ target: { name: "city", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder={isLoading ? "Loading..." : "Select a value"} />
							</SelectTrigger>

							<SelectContent>
								{cities?.data.map((city) => (
									<SelectItem key={city._id} value={city.name} className="capitalize">
										{city.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
					</label>

					<label className="flex w-full flex-col gap-2.5">
						<p className="text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							ID Type
						</p>
						<Select
							name="id_type"
							onValueChange={(value) => handleChange({ target: { name: "id_type", value } })}>
							<SelectTrigger className="flex w-full rounded border-0 bg-neutral-50 px-4 py-[22px] text-base font-normal outline-none ring-1 ring-[#E5E5E5] focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:font-normal data-[placeholder]:text-neutral-500">
								<SelectValue placeholder="Select a value" />
							</SelectTrigger>

							<SelectContent>
								{idTypes.map((type) => (
									<SelectItem key={type} value={type} className="capitalize">
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.id_type && <p className="text-xs text-red-600">{errors.id_type}</p>}
					</label>

					<Input
						type="text"
						name="id_number"
						label="ID Number"
						onChange={handleChange}
						error={errors.id_number}
						placeholder=""
					/>

					<Input
						type="password"
						name="password"
						label="Password"
						onChange={handleChange}
						error={errors.password}
					/>

					<div className="col-span-full flex flex-col gap-4">
						<Input
							type="file"
							name="passport"
							label="Passport"
							onChange={(e) => setFieldValue("passport", e.target.files?.[0])}
							error={errors.passport}
							accept="image/jpeg, image/jpg, image/png"
						/>
						{errors.passport && <p className="text-xs text-red-600">{errors.passport}</p>}

						{/* {values.passport ? (
							<img src={URL.createObjectURL(values?.passport)} className="h-60 w-full object-contain" />
						) : null} */}
					</div>

					<Button type="submit" disabled={isPending} className="col-span-full">
						{isPending ? <Spinner /> : "Add Purchaser"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
