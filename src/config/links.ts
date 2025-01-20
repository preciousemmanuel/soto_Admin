import {
	BagHappy,
	Box,
	Element3,
	FlashCircle,
	MessageQuestion,
	People,
	Setting2,
	UserOctagon,
	Wallet2,
} from "iconsax-react"

export const dashboard_links = [
	{
		label: "Overview",
		href: "/dashboard",
		icon: Element3,
	},
	{
		label: "Wallet",
		href: "/dashboard/wallet",
		icon: Wallet2,
	},
	{
		label: "Orders",
		href: "/dashboard/orders",
		icon: BagHappy,
	},
	{
		label: "Products",
		href: "/dashboard/products",
		icon: Box,
	},
	{
		label: "Coupon & Promo",
		href: "/dashboard/coupon-and-promo",
		icon: FlashCircle,
	},
	{
		label: "Buyers Mgt.",
		href: "/dashboard/buyers",
		icon: People,
	},
	{
		label: "Vendor Mgt.",
		href: "/dashboard/sellers",
		icon: People,
	},
	{
		label: "Purchasers",
		href: "/dashboard/purchasers",
		icon: UserOctagon,
	},
	{
		label: "Disputes",
		href: "/dashboard/disputes",
		icon: FlashCircle,
	},
	{
		label: "Settings and Profile",
		href: "/dashboard/settings-and-profile",
		icon: Setting2,
	},
	{
		label: "Feedback",
		href: "/dashboard/feedback",
		icon: MessageQuestion,
	},
]
