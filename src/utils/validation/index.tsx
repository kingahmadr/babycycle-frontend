// Email validation: Checks if the email is in a valid format
export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

// Password validation: Checks if the password meets specific criteria
export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least one number, one uppercase letter, and one special character
  // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password)
}

// Username validation: Checks if the username is alphanumeric and between 3 to 20 characters
export const validateUsername = (username: string): boolean => {
  // Only allows alphanumeric characters and underscores
  const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/
  return usernamePattern.test(username)
}

export const validateConfirmPassword = (new_password: string, confirm_password: string): boolean => {
  // ConfirmPassword should match Password
  return new_password === confirm_password;
};