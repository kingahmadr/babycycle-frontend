import React from 'react';

interface ModalsAddressProps {
  addresses: {
    name: string;
    contact: string;
    address: string;
  }[];
  handleInputChange: (index: number, field: string, value: string) => void;
}

const ModalsAddress: React.FC<ModalsAddressProps> = ({ addresses, handleInputChange }) => {
  return (
    <>
      {addresses.map((address, index) => (
        <div key={index} className="w-full space-y-4">
          <div className="w-full space-y-1">
            <label className="text-buttonBlue">Name</label>
            <input
              className="w-full h-10 border-2 border-formGray rounded-md"
              type="text"
              name="name"
              value={address.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            />
          </div>
          <div className="w-full space-y-1">
            <label className="text-buttonBlue">Contact</label>
            <input
              className="w-full h-10 border-2 border-formGray rounded-md"
              type="text"
              name="contact"
              value={address.contact}
              onChange={(e) => handleInputChange(index, 'contact', e.target.value)}
            />
          </div>
          <div className="w-full space-y-1">
            <label className="text-buttonBlue">Address</label>
            <textarea
              className="w-full h-40 border-2 border-formGray rounded-md"
              name="address"
              value={address.address}
              onChange={(e) => handleInputChange(index, 'address', e.target.value)}
            ></textarea>
          </div>
          <hr className="my-4 border-formGray" />
        </div>
      ))}
    </>
  );
};

export default ModalsAddress;