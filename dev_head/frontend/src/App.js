import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'

import { Provider } from 'react-redux'
import store from './redux/store'
import Alert from './components/layout/Alert'
import { loadUser } from './redux/actions/auth'
import setAuthToken from './utils/setAuthToken'

import './App.css'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App
