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
    >
      {children}
    </SnackbarProvider>
  );
};
