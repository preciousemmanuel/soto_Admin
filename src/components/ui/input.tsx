import { Eye, EyeSlash, Icon } from "iconsax-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string
	label?: string
	labelClassName?: string
	leadingIcon?: Icon
	wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ className, error, label, labelClassName, leadingIcon: Icon, type, wrapperClassName, ...props },
		ref
	) => {
		const [showPassword, setShowPassword] = React.useState(false)

		return (
			<div className="flex w-full flex-col gap-4">
				{label && (
					<label
						className={cn(
							"text-2xl font-medium leading-none text-[#5d5c5c] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
							labelClassName
						)}>
						{label}
					</label>
				)}
				<div
					className={cn(
						"flex h-[70px] w-full items-center gap-2 rounded-3xl bg-white px-3 py-2",
						wrapperClassName
					)}>
					{Icon && <Icon size={24} className="text-neutral-400" />}
					<input
						type={showPassword ? "text" : type}
						className={cn(
							"flex h-full w-full bg-transparent text-xl outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50",
							className
						)}
						ref={ref}
						{...props}
					/>
					{type === "password" && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="flex items-center justify-center">
							{showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
						</button>
					)}
				</div>
				{error && <p className="text-xs text-red-500">{error}</p>}
			</div>
		)
	}
)
Input.displayName = "Input"

export { Input }
