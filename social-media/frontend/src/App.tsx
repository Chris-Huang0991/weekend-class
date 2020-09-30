import React from 'react'
import { RelayEnvironmentProvider } from 'react-relay/hooks'
import environment from 'providers/relay'
import { Helmet } from 'react-helmet'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import theme from 'providers/theme'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import useRoutes from 'common/routes'

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
        <RelayEnvironmentProvider environment={environment}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
              <React.Suspense fallback='Loading...'>
                <Switch>
                  {useRoutes().map((props, index) => 
                    <Route key={index} {...props} />
                  )}
                </Switch>
              </React.Suspense>
          </ThemeProvider>
        </RelayEnvironmentProvider>
      </BrowserRouter>
    </div>
  )
}
export default App