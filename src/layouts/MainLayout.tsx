import React from 'react'
import { LayoutProps } from '.'

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <main className='max-w-[1440px] flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        {children}
      </main>
    </>
  )
}

export default MainLayout
