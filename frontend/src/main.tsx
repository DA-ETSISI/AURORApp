import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Route, Router} from "react-router-dom"
import PhotoUploader from './page/PhotoUploader'
import "./App.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>\
    <PhotoUploader />
  </StrictMode>,
)
