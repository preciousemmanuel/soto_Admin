import * as Yup from "yup"

export const signinSchema = Yup.object({
	email: Yup.string().email("Please enter a valid email!").required("Email is required!"),
	password: Yup.string()
		.required("Password is required!")
		.matches(
			/^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,20}$/,
			"Password must contain at least one uppercase, lowercase, number and special character!"
		),
})
