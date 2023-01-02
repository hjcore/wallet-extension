import { Routes, Route } from 'react-router-dom'

import RegisterPage from 'src/pages/register'
import WalletPage from 'src/pages/wallet'

const ROUTES = [
  {
    path: '/',
    key: 'ROOT',
    component: <WalletPage />,
  },
  {
    path: '/register',
    key: 'Register',
    exact: true,
    component: <RegisterPage />,
  },
]

const AppRoutes = () => {
  return (
    <Routes>
      {ROUTES.map(route => (
        <Route key={route.key} element={route.component} path={route.path} />
      ))}
    </Routes>
  )
}

export default AppRoutes
