import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formattedStats = (value: any) =>
	Object.keys(value).map((key) => ({ name: key.split("_")?.[0], value: value[key] }))