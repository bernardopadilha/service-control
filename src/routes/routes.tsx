import { RegisterOrder } from '@/pages/register-order'
import { Orders } from '@/pages/orders'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RegisterOrder />
  },
  {
    path: '/tickets',
    element: <Orders />
  }
])