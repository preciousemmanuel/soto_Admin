import { create, StateCreator } from "zustand"

export const reportException =
	<T>(stateCreator: StateCreator<T>): StateCreator<T> =>
	(set, get, api) =>
		stateCreator(
			(args) => {
				try {
					set(args)
				} catch (error: unknown) {
					console.error("Error :(", error)
					throw error
				}
			},
			get,
			api
		)

/**
 * Create a reportable store for zustand
 * @param storeCreator - The store creator
 * @returns The store
 *
 * @example
 * const useUserStore = createReportableStore((set) => ({
 *  ...initialState,
 * setUser: (user) => set({ user }),
 * }));
 *
 * export { useUserStore };
 */
export const createReportableStore = <T>(storeCreator: StateCreator<T>) =>
	create<T>()(reportException<T>(storeCreator))
