import React from 'react'

interface PrimaryButtonProps {
    children: string,
    type: "submit" | "reset" | "button",
    onClick?: () => void,
    className?: string
}

export const PrimaryButton = ({ children, type, onClick } : PrimaryButtonProps) => {
  return (
    <button className='btn-primary' type={ type } onClick={ onClick }>{ children }</button>
  )
}
