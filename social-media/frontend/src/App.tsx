import React from 'react'

import { Helmet } from 'react-helmet'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import theme from 'providers/theme'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import About from 'pages/About'
import Home from 'pages/Home'

const App = () => {
  return (
    <div className='App'>
      <Helmet>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        />
      </Helmet>
      <BrowserRouter >
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <Switch>
              <Route path='/' exact component={Home}/>
              <Route path='/about' exact component={About}/>
            </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}
export default App
