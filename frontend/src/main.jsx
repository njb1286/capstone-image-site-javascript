import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { imageStore } from './store/images-store.js'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={imageStore}>
      <App />
    </Provider>
  </React.StrictMode>,
)
