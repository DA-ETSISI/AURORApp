import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import PhotoUploader from './page/PhotoUploader'
import "./App.css"
import AdminPage from './page/AdminPage'

const router = createBrowserRouter([
    {
      path: '/',
      element: <PhotoUploader />,
    },
    {
      path: '/observer',
      element: <AdminPage />,
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
