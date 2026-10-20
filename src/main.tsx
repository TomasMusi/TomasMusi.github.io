import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './index.css'
import App from './App.tsx'
import { langFromPath } from './lib/lang'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App lang={langFromPath(location.pathname)} />
  </StrictMode>
)

// Production pages are prerendered (scripts/prerender.mjs); the dev server serves an empty root.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
