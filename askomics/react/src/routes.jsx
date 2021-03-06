import React, { Component } from "react"
import { Router, Route, Switch } from "react-router-dom"
import createBrowserHistory from 'history/createBrowserHistory'
import axios from 'axios'

import Ask from './routes/ask/ask'
import Jobs from './routes/jobs/jobs'
import Upload from './routes/upload/upload'
import Integration from './routes/integration/integration'
import Datasets from './routes/datasets/datasets'
import Signup from './routes/login/signup'
import Login from './routes/login/login'
import Logout from './routes/login/logout'
import Account from './routes/account/account'
import Admin from './routes/admin/admin'
import Sparql from './routes/sparql/sparql'
import Query from './routes/query/query'
import AskoNavbar from './navbar'
import AskoFooter from './footer'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const history = createBrowserHistory()

export default class Routes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      waiting: true,
      error: false,
      errorMessage: null,
      logged: false,
      user: {}
    }
    this.cancelRequest
  }


  componentDidMount() {

    let requestUrl = '/api/start'
    axios.get(requestUrl, {cancelToken: new axios.CancelToken((c) => {this.cancelRequest = c})})
    .then(response => {
      console.log(requestUrl, response.data)
      this.setState({
        error: false,
        errorMessage: null,
        user: response.data.user,
        logged: response.data.logged,
        version: response.data.version,
        footerMessage: response.data.footer_message,
        waiting: false
      })
    })
    .catch(error => {
      console.log(error, error.response.data.errorMessage)
      this.setState({
        error: true,
        errorMessage: error.response.data.errorMessage,
        status: error.response.status,
        waiting: false
      })
    })
  }

  render() {
    return (
      <Router history={history}>
        <div>
          <AskoNavbar waitForStart={this.state.waiting} logged={this.state.logged} user={this.state.user}/>
          <Switch>
            <Route path="/" exact component={() => (<Ask waitForStart={this.state.waiting} user={this.state.user} logged={this.state.logged} />)} />
            <Route path="/login" exact component={() => (<Login waitForStart={this.state.waiting} setStateNavbar={p => this.setState(p)} />)} />
            <Route path="/signup" exact component={() => (<Signup waitForStart={this.state.waiting} setStateNavbar={p => this.setState(p)} />)} />
            <Route path="/logout" exact component={() => (<Logout waitForStart={this.state.waiting} setStateNavbar={p => this.setState(p)} />)} />
            <Route path="/account" exact component={() => (<Account waitForStart={this.state.waiting} user={this.state.user} setStateNavbar={p => this.setState(p)} />)} />
            <Route path="/admin" exact component={() => (<Admin waitForStart={this.state.waiting} user={this.state.user} setStateNavbar={p => this.setState(p)} />)} />
            <Route path="/files" exact component={() => (<Upload waitForStart={this.state.waiting} user={this.state.user} logged={this.state.logged} />)} />
            <Route path="/datasets" exact component={() => (<Datasets waitForStart={this.state.waiting} user={this.state.user} logged={this.state.logged} />)} />
            <Route path="/integration" exact component={Integration} />
            <Route path="/query" exact component={Query} />
            <Route path="/sparql" exact component={() => (<Sparql waitForStart={this.state.waiting} user={this.state.user} logged={this.state.logged} />)} />
          </Switch>
          <br />
          <br />
          <AskoFooter version={this.state.version} message={this.state.footerMessage} />
        </div>
      </Router>
    )
  }
}
