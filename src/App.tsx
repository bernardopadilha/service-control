import "@/styles/global.css"

import { Toaster } from 'sonner';
import { router } from './routes/routes'
import { RouterProvider } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from "./contexts/auth-context";


export function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Helmet titleTemplate="%s | Service Control" />
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </HelmetProvider>
    </AuthProvider>
  )
}