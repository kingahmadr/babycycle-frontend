import Image from 'next/image'

const Footer: React.FC = () => {
  return (
    <footer className='bg-textBlue text-white py-30 px-12'>
      <div className='max-w-[1440px] mx-auto'>
        <div className='flex items-center justify-between'>
          {/* Left Section: Text Content */}
          <div className='flex-grow flex flex-wrap gap-x-32'>
            <div>
              <h3 className='text-label-md text-white font-bold'>ABOUT US</h3>
              <ul>
                <li>Our Stories</li>
                <li>Stores</li>
                <li>Promotions</li>
              </ul>
            </div>
            <div>
              <h3 className='text-label-md text-white font-bold'>NEED HELP?</h3>
              <ul>
                <li>Policy</li>
                <li>Return</li>
                <li>Shipping</li>
              </ul>
            </div>
            <div>
              <h3 className='text-label-md text-white font-bold'>CONTACT US</h3>
              <ul>
                <li>cs@babycycle.com</li>
                <li>+62 821 8297 8729</li>
              </ul>
            </div>
          </div>

          {/* Right Section: Logo */}
          <div className='flex-shrink-0 py-10'>
            <Image
              src='/assets/logo_white.png'
              alt='Babycycle Logo'
              width={150}
              height={150}
              className='object-contain'
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
