import { Order } from '@/pages/order'
import { Technical } from '@/pages/technical'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Order />
  },
  {
    path: '/tecnico',
    element: <Technical />
  }
])