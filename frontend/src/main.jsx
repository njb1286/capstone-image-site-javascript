import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { imageStore } from './store/images-store'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={imageStore}>
      <App />
    </Provider>
  </React.StrictMode>,
)
