import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'

import AppRoutes from 'src/routes/routes'
import theme from 'src/theme'

import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
