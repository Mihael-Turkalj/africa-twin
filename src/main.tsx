import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/big-shoulders-stencil-display/700'
import '@fontsource/pt-sans-narrow/400.css'
import '@fontsource/pt-sans-narrow/700.css'
import '@fontsource/akshar/400.css'
import '@fontsource/roboto-condensed/400.css'
import '@fontsource/roboto-condensed/600.css'
import '@fontsource/roboto-condensed/700.css'
import './styles/layout.css'
import './styles/site.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
