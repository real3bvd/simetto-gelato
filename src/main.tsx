import { createRoot } from 'react-dom/client'
import '@fontsource/playfair-display/latin-700.css'
import '@fontsource/playfair-display/latin-500.css'
import '@fontsource/roboto/latin-400.css'
import { App } from './App'
import './menu.css'

createRoot(document.getElementById('root')!).render(<App />)
