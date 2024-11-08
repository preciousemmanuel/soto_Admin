import React from "react"

const Signin = React.lazy(() => import("./signin"))
const Overview = React.lazy(() => import("./dashboard"))
const Wallet = React.lazy(() => import("./wallet"))
const Withdrawal = React.lazy(() => import("./withdrawal"))
const Transfer = React.lazy(() => import("./transfer"))
const Coupon = React.lazy(() => import("./coupon"))
const Order = React.lazy(() => import("./order"))
const Orders = React.lazy(() => import("./orders"))
const Product = React.lazy(() => import("./product"))
const Products = React.lazy(() => import("./products"))
const Buyer = React.lazy(() => import("./buyer"))
const Buyers = React.lazy(() => import("./buyers"))
const Seller = React.lazy(() => import("./seller"))
const Sellers = React.lazy(() => import("./sellers"))
const Settings = React.lazy(() => import("./settings"))
const Feedback = React.lazy(() => import("./feedback"))

export {
	Buyer,
	Buyers,
	Coupon,
	Feedback,
	Order,
	Orders,
	Overview,
	Product,
	Products,
	Seller,
	Sellers,
	Settings,
	Signin,
	Transfer,
	Wallet,
	Withdrawal,
}
