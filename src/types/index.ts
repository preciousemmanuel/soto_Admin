export type Maybe<T> = T | null

export type Undefined<T> = T | undefined

export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}

export type ValueOf<T> = T[keyof T]

export type NonEmptyArray<T> = [T, ...T[]]

export type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never

export interface HttpResponse<T> {
	data: T
	message: string
	status: string
}

export type HttpError = {
	response: {
		data: {
			error: string
			message: string
			status: string
		}
	}
}

export interface PaginationResponse<T> {
	data: T[]
	pagination: {
		pageSize: number
		totalCount: number
		pageCount: number
		currentPage: number
		hasNext: boolean
	}
}

export interface PaginationProps {
	timeLine?: TimelineProps
	limit?: number
	page?: number
}

export type TimelineProps =
	| "YESTERDAY"
	| "TODAY"
	| "THIS_WEEK"
	| "LAST_7_DAYS"
	| "LAST_WEEK"
	| "THIS_MONTH"
	| "LAST_6_MONTHS"
	| "LAST_12_MONTHS"
	| (string & {})

export type StatusProps =
	| "BOOKED"
	| "CANCELLED"
	| "COMPLETED"
	| "CONFIRMED"
	| "DELIVERED"
	| "FAILED"
	| "PENDING"
	| "PICKED"
	| "PROCESSING"
	| "REFUND"
	| "SHIPPED"
	| (string & {})

export type Node = {
	createdAt: Date | string
	deletedBy: Maybe<string>
	deletedAt: Maybe<Date | string>
	id: string
	updateBy: Maybe<string>
	updatedAt: Maybe<Date | string>
}

export type UserProps = Node & {
	email: string
	full_name: string
	profile_image: string
}

export type SiginProps = Node & {
	Email: string
	FirstName: string
	LastName: string
	Token: string
}

// export type SellerProps = Node & {
// 	address: string
// 	email: string
// 	full_name: string
// 	phone_number: string
// 	profile_image: string
// }

export type SellersProps = {
	stats: {
		active_percentage: number
		inactive_percentage: number
		blocked_percentage: number
		others_percentage: number
	}
	revenue_from_sellers_chart: Array<{
		day_or_month: string
		amount: number
	}>
	sellers_data: {
		data: Array<{
			_id: string
			FirstName: string
			LastName: string
			Email: string
			IsActive: boolean
			IsBlocked: boolean
			IsVerified: boolean
			createdAt: Date
			total_quantity: number
			vendor_status: string
			category: string
			product?: string
			business_category_name: string
		}>
		pagination: {
			pageSize: number
			totalCount: number
			pageCount: number
			currentPage: number
			hasNext: boolean
		}
	}
}

export type SellerProps = {
	user: {
		ShippingAddress: {
			country: string
		}
		IsBlocked: boolean
		Rank: string
		_id: string
		FirstName: string
		LastName: string
		Email: string
		Password: string
		UserType: string
		SignupChannel: string
		IsVerified: boolean
		IsActive: boolean
		isBlocked: boolean
		business: {
			_id: string
			business_name: string
			email: string
			phone_number: string
			adress: string
			category: string
			description: string
			business_logo: string
			createdAt: string
			updatedAt: string
			__v: number
			user: string
		}
		createdAt: string
		updatedAt: string
		__v: number
		Token: string
		wallet: string
	}
	total_amount_sold: number
	product_records: PaginationResponse<{
		_id: string
		product_name: string
		createdAt: string
		unit_price: number
		product_quantity: number
		is_verified: boolean
	}>
}

export type BuyersProps = {
	revenue_from_buyers_chart: Array<{
		day_or_month: string
		amount: number
	}>
	data: Array<{
		_id: string
		FirstName: string
		LastName: string
		Email: string
		ProfileImage: string
		Rank?: string
		createdAt: string
		total_spent: number
		total_orders: number
		total_items_ordered: number
		last_order_price: number
	}>
	pagination: {
		pageSize: number
		totalCount: number
		pageCount: number
		currentPage: number
		hasNext: boolean
	}
}

export type BuyerProps = {
	user: {
		ShippingAddress: {
			full_address: string
			address: string
			city: string
			state: string
			postal_code: string
			country: string
		}
		Rank: string
		_id: string
		FirstName: string
		LastName: string
		Email: string
		Password: string
		PhoneNumber: string
		UserType: string
		SignupChannel: string
		createdAt: string
		updatedAt: string
		__v: number
		Token: string
		IsVerified: boolean
	}
	total_amount_spent: number
	orderRecords: PaginationResponse<{
		_id: string
		tracking_id: string
		createdAt: string
		status: string
		grand_total: number
	}>
}

export type ProductProps = Node & {
	__typename?: "Product"
	_id: string
	description: string
	height: number
	images: string[]
	in_stock: boolean
	is_verified: boolean
	is_deleted: boolean
	is_discounted: boolean
	discount_price: number
	total_quantity_sold: number | undefined
	product_id:
		| string
		| {
				total_quantity_sold: number
				images: string[]
		  }
	product_name: string
	product_quantity: number
	unit_price: number
	vendor: {
		Email: string
		FirstName: string
		LastName: string
		images: Array<string>
		_id: string
	}
	weight: number
	width: number
	assigned_purchaser: {
		_id: string
		FirstName: string
		LastName: string
		Email: string
		ProfileImage: string
		PhoneNumber: string
		status: string
		createdAt: string
		updatedAt: string
	}
}

export type SingleProductProps = {
	product: {
		_id: string
		product_name: string
		description: string
		category: {
			_id: string
			name: string
			__v: number
			createdAt: string
			updatedAt: string
			image: string
		}
		images: Array<string>
		vendor: string
		unit_price: number
		product_quantity: number
		total_quantity_sold: number
		height: number
		width: number
		weight: number
		is_discounted: boolean
		in_stock: boolean
		is_verified: boolean
		is_deleted: boolean
		createdAt: string
		updatedAt: string
		__v: number
		decline_product_note: string
	}
	reviews: Array<{
		_id: string
		comment: string
		product: string
		user?: {
			_id: string
			FirstName: string
			LastName: string
			Email: string
		}
		rating: number
		createdAt: string
		updatedAt: string
		__v: number
	}>
	total_reviews: number
}

export type OrderProps = Node & {
	__typename?: "Order"
	_id: string
	items: ProductProps[]
	status: StatusProps
	total_amount: number
	delivery_amount: number
	shipping_address: string
	order_itinerary: {
		[key: string]: string
	}
	tracking_id: string
	grand_total: number
	payment_type: string
	is_coupon_applied: boolean
	shipment_charges: boolean
	applied_coupon: string
	min_price: number
	product_name: string
	product_brand: string
	email: string
	phone_number: string
	note: string
	size: string
	color: string
	type: string
	decline__note: string
	max_price: number
	approval_status: string
	quantity: number
	general_coupon: {
		_id: string
		name: string
		audience: string
		code: string
		activation_date: string
		expiry_date: string
		remove_expiry_date: boolean
		amount_type: string
		coupon_type: string
		condition: string
		is_condition: boolean
		usage_limit: number
		remove_usage_limit: boolean
		total_subscribers: number
		active_status: boolean
		createdAt: string
		updatedAt: string
		__v: number
		amount: number
		total_usage: number
	}
	user: {
		_id: string
		Email: string
		FirstName: string
		LastName: string
		PhoneNumber: string
	}
	payment_details: Array<{
		payment_provider: string
		_id: string
		reference: string
		amount: number
		user: string
		type: string
		status: string
		currency: string
		narration: string
		narration_id: string
		createdAt: string
		updatedAt: string
		__v: number
	}>
}

export type TransactionProps = Node & {
	amount: number
	payment_type: "card" | "transfer"
	status: "cancelled" | "pending" | "success"
	tracking_id: string
	type: "credited" | "withdrew"
	user: {
		_id: string
		FirstName: string
		LastName: string
		Role: "buyer" | "seller"
	}
}

export type LatestOrderProps = Node & {
	product_id: string
	product_name: string
	quantity: number
	unit_price: number
	createdAt: Date | string
	status: StatusProps
	total_price: number
	order: string
	images: string[]
}

export type CreateCouponPayload = {
	name: string
	coupon_type: string
	amount: number
	applied_to: string
	activation_date: string
	expiry_date: string
	remove_expiry_date: string
	remove_usage_limit: string
	usage_limit: number
}

export type UpdateCouponPayload = {
	amount: number
	active_status: string
	usage_limit: number
}

export type CouponProps = Node & {
	total_usage: number
	name: string
	audience: string
	code: string
	activation_date: string
	expiry_date: string
	remove_expiry_date: boolean
	amount_type: string
	coupon_type: string
	condition: string
	is_condition: boolean
	usage_limit: number
	remove_usage_limit: boolean
	total_subscribers: number
	active_status: boolean
	amount: number
}

export type CouponTypeProps =
	| "PRICE_DISCOUNT"
	| "FIXED_DISCOUNT"
	| "PERCENTAGE_DISCOUNT"
	| "FREE_SHIPPING"

export type WalletOverviewProps = {
	transaction: {
		amount: number
		percentage_change: number
	}
	income: {
		amount: number
		percentage_change: number
	}
	withdrawal: {
		amount: number
		percentage_change: number
	}
	remittance: {
		amount: number
		percentage_change: number
	}
	transaction_logs: PaginationResponse<{
		_id: string
		reference: string
		amount: number
		user: {
			_id: string
			FirstName: string
			LastName: string
			Email: string
			UserType: string
		}
		type: string
		status: string
		currency: string
		narration: string
		narration_id: string
		createdAt: string
		updatedAt: string
		__v: number
	}>
}

export type WithdrawalRequestsProps = PaginationResponse<{
	_id: string
	amount: number
	account_name: string
	account_number: string
	status: string
	createdAt: string
	vendor_name: string
	vendor_email: string
	vendor_logo: string
	bank: string
}>

export type SettingsProps = {
	ShippingAddress: {
		country: string
		full_address: string
		address: string
		city: string
		state: string
		postal_code: string
	}
	withdrawals: {
		manual: string
		scheduled: string
		frequency: number
	}
	interest_rates: {
		flat: number
		special: number
	}
	order_itinerary: {
		step_1: ItineraryStep
		step_2: ItineraryStep
		step_3: ItineraryStep
		step_4: ItineraryStep
	}
	_id: string
	createdAt: string
	updatedAt: string
	__v: number
}

type ItineraryStep = {
	level: number
	description: string
}

export type PurchasersProps = PaginationResponse<{
	address_details: {
		coordinates: {
			lat: number
			lng: number
		}
		full_address: string
		address: string
		address_id: string
		city: string
		country: string
		postal_code: string
	}
	_id: string
	FirstName: string
	LastName: string
	Email: string
	PhoneNumber: string
	Password: string
	Role: string
	coordinate: Array<number>
	createdAt: string
	updatedAt: string
	UniqueId: string
	id_type: string
	id_number: string
	__v: number
	Token: string
	address_id: string
}>

export type PickupsProps = PaginationResponse<{
	_id: string
	tracking_id: string
	order_id: string
	purchaser: {
		_id: string
		profile_image: string
		first_name: string
		last_name: string
	}
	createdAt: string
	quantity: number
	vendor_contact: {
		first_name: string
		last_name: string
		phone_number: string
	}
	status: string
}>

export type ProfileProps = {
	address_details: {
		coordinates: {
			lat: number
			lng: number
		}
		full_address: string
		address: string
		address_id: string
		city: string
		country: string
		postal_code: string
	}
	_id: string
	FirstName: string
	LastName: string
	ProfileImage: string
	Email: string
	PhoneNumber: string
	Password: string
	Role: {
		admin: {
			read: string
			write: string
		}
		config: {
			read: string
			write: string
		}
		order: {
			read: string
			write: string
		}
		buyer: {
			read: string
			write: string
		}
		seller: {
			read: string
			write: string
		}
		product: {
			read: string
			write: string
		}
		transaction: {
			read: string
			write: string
		}
		_id: string
		name: string
		createdAt: string
		updatedAt: string
		__v: number
	}
	coordinate: Array<number>
	createdAt: string
	updatedAt: string
	__v: number
	Token: string
	address_id: string
}

// export type RolesProps = PaginationResponse<ProfileProps["Role"]>

export type AdminProps = PaginationResponse<ProfileProps>

export type CategoriesProps = PaginationResponse<{
	_id: string
	name: string
	__v: number
	createdAt: string
	updatedAt: string
	image: string
}>

export type NotificationsProps = PaginationResponse<{
	_id: string
	sender: string
	receiver: string
	type: string
	status: boolean
	category: string
	category_id: string
	content: string
	title: string
	deleted: boolean
	is_read: boolean
	createdAt: string
	updatedAt: string
	__v: number
}>

export type StatesProps = Array<{
	_id: string
	name: string
	isoCode: string
	countryCode: "NG"
	latitude: string
	longitude: string
}>

export type CitiesProps = Array<{
	_id: string
	name: string
	countryCode: "NG"
	stateCode: string
	latitude: string
	longitude: string
}>

export type RolesProps = PaginationResponse<{
	admin: {
		read: string
		write: string
	}
	config: {
		read: string
		write: string
	}
	order: {
		read: string
		write: string
	}
	buyer: {
		read: string
		write: string
	}
	seller: {
		read: string
		write: string
	}
	product: {
		read: string
		write: string
	}
	transaction: {
		read: string
		write: string
	}
	_id: string
	name: string
	createdAt: string
	updatedAt: string
}>