// This file is the main entry point for the react frontend

import React from 'react'
// React itself is just a UI library. ReactDOM connects React to the html in your browser window
import ReactDOM from 'react-dom/client'
// this imports the root component, App.tsx is like the container for all the components, pages, and individual ui stuff
import App from './App'
// This brings in global styles.
// Unlike App.css (which often applies styles to just your App), index.css usually contains base styles like resetting margins, setting fonts, or global colors.
import './index.css'
// pulls in Mapbox css styling
import 'mapbox-gl/dist/mapbox-gl.css'

// document.getElementById('root')! → Finds the <div id="root"></div> in your index.html
// createRoot().render() creates a react root inside that <div> and render the app into it
// React strict mode is a development tool. It activates extra checks and warnings for your app in development mode
// (e.g., highlighting deprecated features, double-invoking some functions to check for side effects).
// It does nothing in production, so it’s safe to leave it on.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
