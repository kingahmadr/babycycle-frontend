interface PrimaryButtonProps {
    children: string,
    type: "submit" | "reset" | "button",
    onClick?: () => void,
    className?: string,
    disabled?: boolean
}

export const PrimaryButton = ({ children, type, onClick, disabled, className } : PrimaryButtonProps) => {
  return (
    <button  className={`btn-primary ${disabled ? "btn-disabled" : ""} ${className}`}
      type={ type } 
      onClick={ onClick } 
      disabled={ disabled }>{ children }
    </button>
  )
}
