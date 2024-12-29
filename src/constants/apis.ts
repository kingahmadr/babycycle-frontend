export const API_URL = 'https://api.babycycle.my.id/api/v1'
export const API_URL_LOCAL = 'http://127.0.0.1:5100/api/v1'
export const API_LOGIN = `${API_URL_LOCAL}/auth/login`
export const API_REGISTER = `${API_URL}/users/register`
export const API_RESEND = `${API_URL}/users/resend_verification`
export const API_VERIFY = `${API_URL}/users/verify`
export const API_ME = `${API_URL}/users/me`
export const API_FORGOT_PASSWORD = `${API_URL}/users/forgot-password`
export const API_RESET_PASSWORD = `${API_URL}/users/reset-password`
export const API_PROFILE_IMAGE = `${API_URL_LOCAL}/users/profile/image`
export const API_UPDATE_PROFILE = `${API_URL_LOCAL}/users/profile`

export const API_CHECKOUT = `${API_URL}/checkout/now`
export const API_CHECKOUT_ITEM = `${API_URL_LOCAL}/checkout/items`
export const API_CHECKOUT_VALIDATION = `${API_URL}/checkout/validate`
export const API_CARTS_CLEAR = `${API_URL}/carts/clear`
export const API_CARTS = `${API_URL_LOCAL}/carts`

export const API_TRANSACTION = `${API_URL_LOCAL}/transactions`
export const API_REVIEW = `${API_URL_LOCAL}/reviews`

export const API_GET_PRODUCT = `${API_URL}/products`
export const API_SEARCH = `${API_URL}/search/products`
export const API_PRODUCT_WITH_COUNT = `${API_URL}/products/with/count`

export const API_ADDRESSES = `${API_URL_LOCAL}/addresses`
export const API_ADDRESSES_MAIN = `${API_ADDRESSES}/set-as-main`