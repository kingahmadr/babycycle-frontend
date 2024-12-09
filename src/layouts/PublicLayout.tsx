import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <main className='w-full flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        {children}
      </main>
    </>
  );
};

export default PublicLayout;
