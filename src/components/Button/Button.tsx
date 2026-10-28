import type { ReactNode } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'outline' | 'transparent' | 'Destructive' |
  '

export interface ButtonProps {
  /** Visible label. Figma: "Label" text property. */
  label: string
  /** Figma: "Type" variant (Default → primary, Outline → outline, Transparent → transparent, Destructive → destructive). */
  variant?: ButtonVariant
  /** Figma: "Status = disabled". Hover and focus are runtime states, not props. */
  disabled?: boolean
  /** Figma: "Icon left" boolean + "Icon Left swap" instance. */
  iconLeft?: ReactNode
  /** Figma: "Icon right" boolean + "Icon  Right Swap" instance. */
  iconRight?: ReactNode
  onClick?: () => void
}

export function Button({ label, variant = 'primary', disabled = false, iconLeft, iconRight, onClick }: ButtonProps) {
  return (
    <button className={`ds-button ds-button--${variant}`} disabled={disabled} onClick={onClick} type="button">
      {iconLeft && <span className="ds-button__icon" aria-hidden="true">{iconLeft}</span>}
      <span className="ds-button__label">{label}</span>
      {iconRight && <span className="ds-button__icon" aria-hidden="true">{iconRight}</span>}
    </button>
  )
}
