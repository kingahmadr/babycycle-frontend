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

interface UserProfileProps {
  type: "userProfile";
  profile_data: {
    username: string;
    email: string;
    phone: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  handleInputChange: (field: string, value: string) => void; // Removed index as it's not used
}

type ModalsProps = AddressModalProps | ConfirmationModalProps | UserProfileProps;

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
    
      case "userProfile":
        return (
          <>
            <div className="w-full space-y-4">
              <div className="w-full space-y-1">
                <label className="text-buttonBlue">Name</label>
                <input
                  className="w-full h-10 border-2 border-formGray rounded-md p-6"
                  type="text"
                  name="username"
                  value={props.profile_data.username || ""}
                  onChange={(e) => props.handleInputChange("username", e.target.value)}
                />
              </div>
              <div className="w-full space-y-1">
                <label className="text-buttonBlue">Email</label>
                <input
                  className="w-full h-10 border-2 border-formGray rounded-md p-6"
                  type="email"
                  name="email"
                  value={props.profile_data.email || ""}
                  onChange={(e) => props.handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="w-full space-y-1">
                <label className="text-buttonBlue">Phone</label>
                <input
                  className="w-full h-10 border-2 border-formGray rounded-md p-6"
                  type="text"
                  name="phone"
                  value={props.profile_data.phone || ""}
                  onChange={(e) => props.handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <SecondaryButton type="button" onClick={props.onCancel}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="button" onClick={props.onConfirm}>
                  Submit
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