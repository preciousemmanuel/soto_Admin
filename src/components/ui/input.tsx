import { Eye, EyeSlash, Icon } from "iconsax-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string
	label?: string
	labelClassName?: string
	leadingIcon?: Icon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, error, label, labelClassName, leadingIcon: Icon, type, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false)

		return (
			<div className="flex w-full flex-col gap-2">
				{label && (
					<label
						className={cn(
							"px-2 text-sm font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
							labelClassName
						)}>
						{label}
					</label>
				)}

				<div className="relative">
					{Icon && (
						<Icon size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
					)}

					<input
						type={showPassword ? "text" : type}
						className={cn(
							`flex w-full rounded-3xl bg-red-200 px-6 py-3.5 text-base font-medium outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${Icon && "pl-12"}`,
							className
						)}
						ref={ref}
						{...props}
					/>
					{type === "password" && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
							{showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
						</button>
					)}
				</div>

				{error && <p className="px-2 text-xs font-medium text-red-600">{error}</p>}
			</div>
		)
	}
)
Input.displayName = "Input"

export { Input }
