import "@/styles/global.css"

import { Toaster } from 'sonner';
import { router } from './routes/routes'
import { RouterProvider } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'


export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Service Control" />
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
    </HelmetProvider>
  )
}