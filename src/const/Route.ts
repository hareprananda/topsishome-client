export const Route = {
  Home: '/dashboard',
  Login: '/login',
  Register: '/register',
  Alternative: '/dashboard/alternative',
  AlternativeDetail: (id: string) => `/dashboard/alternative/${id}`,
  AlternativeAdd: '/dashboard/alternative/add',
  Criteria: '/dashboard/criteria',
  Selection: '/dashboard/selection',
  Result: '/dashboard/result',
} as const
