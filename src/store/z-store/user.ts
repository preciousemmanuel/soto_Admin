import Cookies from "js-cookie"

import { createPersistMiddleware } from "@/store/middleware"
import { Maybe, UserProps } from "@/types"

interface UserStore {
	user: Maybe<UserProps>
	isAuthenticated: boolean
	signIn: (user: UserProps, token: string) => void
	signOut: (options?: { redirectTo?: string; soft?: boolean }) => void
}

const initialState: UserStore = {
	user: null,
	isAuthenticated: true,
	signIn: () => {},
	signOut: () => {},
}

const useUserStore = createPersistMiddleware<UserStore>(
	"SOTO_ADMIN",
	(set) => ({
		...initialState,
		signIn: (user, token) => {
			set({ user, isAuthenticated: true })
			Cookies.set("SOTO_ADMIN_TOKEN", token, {
				sameSite: "None",
				secure: true,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days,
			})
		},
		signOut: async (options) => {
			try {
				if (options?.soft) {
					set({ user: null, isAuthenticated: false })
				} else {
					set({ user: null, isAuthenticated: false })
					Cookies.remove("SOTO_ADMIN_TOKEN")
				}
			} catch (error) {
				console.error("sign out error:", error)
			} finally {
				window.localStorage.removeItem("spaceet-user")
				window.location.replace(options?.redirectTo || "/")
			}
		},
	})
)

export { useUserStore }
