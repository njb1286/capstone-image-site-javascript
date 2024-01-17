import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { imageStore } from './store/images/images-store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={imageStore}>
      <App />
    </Provider>
  </React.StrictMode>,
)
