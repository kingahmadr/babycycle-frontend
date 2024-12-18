export type UserRole = 'USER' | 'ADMIN'

export interface UserData {
  data: UserModel
}

export interface UserModel {
  id: number
  username: string
  email: string
  password: string
  role: UserRole
  address?: string
  phone?: string
  is_seller: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type UserRegisterModel = Pick<
  UserModel,
  'username' | 'email' | 'password'
>
export type UserLoginModel = Pick<UserModel, 'email' | 'password'>
export interface UserVerificationModel extends Pick<UserModel, 'email'> {
  verification_code: string
}
