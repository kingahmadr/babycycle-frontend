interface SecondaryButtonProps {
    children: string,
    type: "submit" | "reset" | "button",
    onClick?: () => void,
    className?: string
}

export const SecondaryButton = ({ children, type, onClick } : SecondaryButtonProps) => {
  return (
    <button className='btn-secondary' type={ type } onClick={ onClick }>{ children }</button>
  )
}
