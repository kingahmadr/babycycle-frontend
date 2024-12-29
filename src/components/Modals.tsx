import React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface Address {
  name: string;
  contact: string;
  address: string;
}

interface AddressModalProps {
  type: "address";
  addresses: Address[];
  handleInputChange: (index: number, field: string, value: string) => void;
}

interface ConfirmationModalProps {
  type: "confirmation";
  onConfirm: () => void;
  onCancel: () => void;
}

type ModalsProps = AddressModalProps | ConfirmationModalProps;

const Modals: React.FC<ModalsProps> = (props) => {
  switch (props.type) {
    case "address":
      return (
        <>
          {props.addresses.map((address, index) => (
            <div key={index} className="w-full space-y-4">
              <div className="w-full space-y-1">
                <label className="text-buttonBlue">Name</label>
                <input
                  className="w-full h-10 border-2 border-formGray rounded-md"
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={(e) => props.handleInputChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="w-full space-y-1">
                <label className="text-buttonBlue">Contact</label>
                <input
                  className="w-full h-10 border-2 border-formGray rounded-md"
                  type="text"
                  name="contact"
                  value={address.contact}
                  onChange={(e) => props.handleInputChange(index, 'contact', e.target.value)}
                />
              </div>
              <div className="w-full space-y-1">
                <label className="text-buttonBlue">Address</label>
                <textarea
                  className="w-full h-40 border-2 border-formGray rounded-md"
                  name="address"
                  value={address.address}
                  onChange={(e) => props.handleInputChange(index, 'address', e.target.value)}
                ></textarea>
              </div>
              <hr className="my-4 border-formGray" />
            </div>
          ))}
        </>
      );

    case "confirmation":
      return (
        <>
          <div className="w-full space-y-4">
            <p className="text-buttonBlue">Are you sure you want to delete this address?</p>
            <div className="flex justify-end space-x-4">
              <SecondaryButton type="button" onClick={props.onCancel}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="button" onClick={props.onConfirm}>
                Delete
              </PrimaryButton>
            </div>
          </div>
        </>
      );

    default:
      console.warn("Unexpected modal type:", props);
      return null;
  }
};

export default Modals;