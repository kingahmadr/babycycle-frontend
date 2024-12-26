import React, { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

export const SnackbarVariantsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      autoHideDuration={5000} // Automatically dismiss after 5 seconds
    >
      {children}
    </SnackbarProvider>
  );
};
