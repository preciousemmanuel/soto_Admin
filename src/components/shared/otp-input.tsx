import React from "react"

interface Props {
	length: number
	onChange: (value: string) => void
	value: string
}

export const OtpInput = (props: Props) => {
	const { length = 5, onChange, value } = props

	const values = React.useMemo(() => {
		return Array.from({ length: length }, (_, i) => value[i] || "")
	}, [length, value])

	const focusToNextInput = (target: HTMLElement) => {
		const nextElementSibling = target.nextElementSibling as HTMLInputElement | null
		if (nextElementSibling) {
			nextElementSibling.focus()
		}
	}

	const focusToLastInput = (target: HTMLElement) => {
		const previousElementSibling = target.previousElementSibling as HTMLInputElement | null
		if (previousElementSibling) {
			previousElementSibling.focus()
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newValue = value.slice(0, index) + e.target.value + value.slice(index + 1)
		onChange(newValue.slice(0, length))
		if (e.target.value !== "" && index < length - 1) {
			focusToNextInput(e.target)
		}
	}

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		const target = e.target
		const lastInputElement = target.previousElementSibling as HTMLInputElement | null
		if (lastInputElement && lastInputElement.value === "") {
			return lastInputElement.focus()
		}
		target.setSelectionRange(0, target.value.length)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			e.preventDefault()
			return focusToNextInput(target)
		}

		if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			e.preventDefault()
			return focusToLastInput(target)
		}

		target.setSelectionRange(0, target.value.length)
		if (e.key !== "Backspace" || target.value !== "") return

		focusToLastInput(target)
	}

	return (
		<div className="flex items-center justify-center gap-3">
			{values.map((value, index) => (
				<MemoizedInput
					key={index}
					type="text"
					value={value}
					className="flex h-24 w-[77px] select-none items-center justify-center rounded-md bg-[#F6F4F7] px-3 py-2 text-center font-medium outline-none focus:border-2"
					onChange={(e) => handleChange(e, index)}
					onFocus={handleFocus}
					onKeyDown={handleKeyDown}
					inputMode="numeric"
					autoComplete="one-time-code"
					pattern="\d{1}"
					maxLength={length}
				/>
			))}
		</div>
	)
}

const MemoizedInput = React.memo(
	({ value, ...props }: { value: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
		<input {...props} value={value} />
	)
)

MemoizedInput.displayName = "OTP Input"
