import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-textBlue text-white py-8 px-12">
      <div className="flex justify-between">
        <div>
          <h3 className="text-label-md font-bold">ABOUT US</h3>
          <ul>
            <li>Our Stories</li>
            <li>Stores</li>
            <li>Promotions</li>
          </ul>
        </div>
        <div>
          <h3 className="text-label-md font-bold">NEED HELP?</h3>
          <ul>
            <li>Policy</li>
            <li>Return</li>
            <li>Shipping</li>
          </ul>
        </div>
        <div>
          <h3 className="text-label-md font-bold">CONTACT US</h3>
          <ul>
            <li>cs@babycycle.com</li>
            <li>+62 821 8297 8729</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
