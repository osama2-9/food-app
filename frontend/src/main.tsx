import {RecoilRoot} from 'recoil'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <RecoilRoot >

    <App />
  </RecoilRoot>
  </BrowserRouter>
)
