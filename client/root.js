import React from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import Home from './components/_Home'

const Root = () => {
  return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            <Route component={() => <Home />} />
          </Switch>
        </BrowserRouter>
  )
}

export default Root
