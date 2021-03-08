import React, { Suspense } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'

import SignIn from './components/_SignIn'

const Home = React.lazy(() => import(/*
webpackChunkName: "Home Page",
webpackPrefetch: true
*/ './components/_Home'))

const PrivateRoute = ({ component: Component, ...rest }) => {
  const func = (props) =>
  rest.location.user ? <Component {...props} /> : <Redirect to={{ pathname: '/signin' }} />
  // true ? <Component {...props} /> : <Redirect to={{ pathname: '/signin' }} />
  return <Route {...rest} render={func} />
}

const Root = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/signin" component={SignIn} />
          <Route component={() => <Home />} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default Root
