export const PAGE_LANDING = '/'
export const PAGE_LOGIN = '/login'
export const PAGE_REGISTER = '/register'
export const PAGE_LISTING = '/product'
export const PAGE_SELLER = '/seller-dashboard'
export const PAGE_DASHBOARD = '/dashboard'
export const PAGE_REVIEW = '/add_review'
export const PAGE_ADD_ITEM = '/AddItem'

export const PUBLIC_ROUTES = [PAGE_LANDING, PAGE_LOGIN, PAGE_REGISTER]

export const PROTECTED_ROUTES: string[] = ["/protected-route-1", "/protected-route-2", PAGE_SELLER, PAGE_DASHBOARD, PAGE_REVIEW, PAGE_ADD_ITEM];
