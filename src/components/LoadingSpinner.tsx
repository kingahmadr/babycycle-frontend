import React from 'react'

interface LoadingSpinnerProps {
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div
      className={`border-8 border-buttonBlue border-t-transparent rounded-full animate-spin ${className}`}
    ></div>
  )
}

export default LoadingSpinner
