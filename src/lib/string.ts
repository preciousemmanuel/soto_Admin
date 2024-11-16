type RangeProps = {
	amount: number
	day_or_month: Date | string
}

export const getInitials = (value: string) => {
	const words = value.split(" ")
	const initials = words.map((word) => word.charAt(0).toUpperCase())
	return initials.join("")
}

export const capitalize = (value?: string) => {
	if (!value) return ""
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export const encodeQueryParams = (params: { [key: string]: string | number | boolean }) => {
	type Key = keyof typeof params
	return Object.keys(params)
		.filter(
			(key) =>
				params[key as Key] !== null && params[key as Key] !== undefined && params[key as Key] !== ""
		)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key as Key] as string)}`)
		.join("&")
}

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
		maximumFractionDigits: 2,
	}).format(amount)
}

export const formatPrice = (price: number) => {
	if (price < 1000) {
		return formatCurrency(price)
	} else if (price > 1000 && price < 1000000) {
		return formatCurrency(price / 1000) + "k"
	} else if (price > 1000000) {
		return formatCurrency(price / 1000000) + "M"
	} else {
		return formatCurrency(price)
	}
}

export const getTimeFromNow = (date: Date | string) => {
	const now = new Date()
	const diffInMilliseconds = now.getTime() - new Date(date).getTime()

	const second = 1000
	const minute = second * 60
	const hour = minute * 60
	const day = hour * 24
	const month = day * 30
	const year = month * 12

	if (diffInMilliseconds < minute) {
		return `${Math.floor(diffInMilliseconds / second)} seconds ago`
	} else if (diffInMilliseconds < hour) {
		return `${Math.floor(diffInMilliseconds / minute)} minutes ago`
	} else if (diffInMilliseconds < day) {
		return `${Math.floor(diffInMilliseconds / hour)} hours ago`
	} else if (diffInMilliseconds < month) {
		return `${Math.floor(diffInMilliseconds / day)} days ago`
	} else if (diffInMilliseconds < year) {
		return `${Math.floor(diffInMilliseconds / month)} months ago`
	} else {
		return `${Math.floor(diffInMilliseconds / year)} years ago`
	}
}

export const aggregateAmount = (data?: RangeProps[]) => {
	if (!data || data.length === 0) return 0
	return data.reduce((acc, curr) => {
		return acc + curr.amount
	}, 0)
}
