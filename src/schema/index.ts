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
		.min(new Date(), "Activation date must be in the future!")
		.min(Yup.ref("activation_date"), "Expiry date must be after activation date!"),
	usage_limit: Yup.number()
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

export const createDiscountCouponSchema = Yup.object({
	quantity: Yup.number()
		.required("Quantity is required!")
		.typeError("Quantity must be a number!")
		.min(1, "Quantity must be greater than 0!"),
	discount: Yup.number()
		.required("Discount is required!")
		.typeError("Discount must be a number!")
		.min(1, "Discount must be greater than 0!")
		.max(100, "Discount must be less than 100!"),
	activation_date: Yup.date()
		.required("Activation date is required!")
		.min(new Date(), "Activation date must be in the future!"),
	expiry_date: Yup.date()
		.required("Expiry date is required!")
		.min(new Date(), "Activation date must be in the future!")
		.min(Yup.ref("activation_date"), "Expiry date must be after activation date!"),
	product_category: Yup.string().required("Product category is required!"),
})

export const addAdminSchema = Yup.object({
	first_name: Yup.string().required("First name is required!"),
	last_name: Yup.string().required("Last name is required!"),
	email: Yup.string().email("Please enter a valid email!").required("Email is required!"),
	phone_number: Yup.string()
		.required("Phone is required!")
		.max(11, "Phone number must be 11 digits!"),
	role: Yup.string().required("Role is required!"),
	address: Yup.string().required("Address is required!"),
	city: Yup.string().required("City is required!"),
	postal_code: Yup.string().required("Postal code is required!"),
	state: Yup.string().required("State is required!"),
	country: Yup.string().required("Country is required!"),
})

// export const addPurchaserSchema = addAdminSchema.omit(["role", "country"])
export const idTypes = ["NIN", "BVN", "Drivers License", "Voters Card", "International Passport"]
const allowedExtension = ["image/jpeg", "image/jpg", "image/png"]
export const addPurchaserSchema = Yup.object({
	first_name: Yup.string().required("First name is required!"),
	last_name: Yup.string().required("Last name is required!"),
	email: Yup.string().email("Please enter a valid email!").required("Email is required!"),
	phone_number: Yup.string()
		.required("Phone is required!")
		.max(11, "Phone number must be 11 digits!"),
	address: Yup.string().required("Address is required!"),
	city: Yup.string().required("City is required!"),
	state: Yup.string().required("State is required!"),
	id_type: Yup.mixed().oneOf(idTypes).required("ID type is required!"),
	id_number: Yup.string().required("ID number is required!"),
	passport: Yup.string().required("Passport is required!"),
	password: Yup.mixed()
		.required("Password is required!").nullable()
		.test(
			"is-valid-type",
			"Only jpg, jpeg and png image format are allowed",
			// @ts-expect-error nil
			(val) => !val || !allowedExtension.includes(val && val?.type)
	),
})

export const declineProductSchema = Yup.object({
	decline_product_note: Yup.string().required("Reason is required!"),
})

