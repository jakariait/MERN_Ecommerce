import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'quill/dist/quill.snow.css'; // in main.jsx or App.jsx
import "react-loading-skeleton/dist/skeleton.css";




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
