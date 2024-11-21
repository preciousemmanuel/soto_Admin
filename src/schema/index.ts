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

const coupon_types = ["FIXED_DISCOUNT", "PERCENTAGE_DISCOUNT", "FREE_SHIPPING", "PRICE_DISCOUNT"]
export const createCouponSchema = Yup.object({
	name: Yup.string().required("Name is required!"),
	coupon_type: Yup.mixed().oneOf(coupon_types).required("Coupon type is required!"),
	amount: Yup.number().required("Amount is required!").typeError("Amount must be a number!"),
	applied_to: Yup.mixed().oneOf(["USER", "VENDOR"]).required("Applied to is required!"),
	activation_date: Yup.date()
		.required("Activation date is required!")
		.min(new Date(), "Activation date must be in the future!"),
	expiry_date: Yup.date()
		.required("Expiry date is required!")
		.min(new Date(), "Activation date must be in the future!")
		.min(Yup.ref("activation_date"), "Expiry date must be after activation date!"),
	usage_limit: Yup.number()
		.required("Usage limit is required!")
		.typeError("Usage limit must be a number!")
		.integer("Usage limit must be a whole number!"),
})

export const updateCouponSchema = Yup.object({
	amount: Yup.number().required("Amount is required!").typeError("Amount must be a number!"),
	active_status: Yup.mixed().oneOf(["YES", "NO"]).required("Active status is required!"),
	usage_limit: Yup.number()
		.required("Usage limit is required!")
		.typeError("Usage limit must be a number!")
		.integer("Usage limit must be a whole number!"),
})


