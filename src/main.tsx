import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

const node = document.getElementById('root')!
const app = <React.StrictMode><App /></React.StrictMode>

// Vite development starts with an empty root; production HTML is pre-rendered.
if (node.hasChildNodes()) {
  ReactDOM.hydrateRoot(node, app)
} else {
  ReactDOM.createRoot(node).render(app)
}
