import { useId, useState } from 'react'

export default function FloatingInput({ label, error, value, type = 'text', ...props }) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const active = focused || (value !== undefined && value !== '')

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onFocus={(e) => {
          setFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          props.onBlur?.(e)
        }}
        placeholder=" "
        {...props}
        className={`w-full rounded-xl border bg-white/70 px-4 pb-2.5 pt-5 text-sm text-ink outline-none transition focus:ring-2 dark:bg-white/5 dark:text-white ${
          error
            ? 'border-red-400 focus:ring-red-100'
            : focused
            ? 'border-brand shadow-[0_0_0_4px_rgba(255,138,0,0.12)]'
            : 'border-gray-200 dark:border-white/10'
        }`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-150 ${
          active ? 'top-1.5 text-[10px] font-medium' : 'top-1/2 -translate-y-1/2 text-sm'
        } ${error ? 'text-red-500' : focused ? 'text-brand' : 'text-ink/40 dark:text-white/40'}`}
      >
        {label}
      </label>
    </div>
  )
}
