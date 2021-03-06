import React, { Component } from "react"
import axios from 'axios'
import { Alert, Input, Button, ButtonGroup } from 'reactstrap'
import { Redirect} from 'react-router-dom'
import ErrorDiv from "../error/error"
import WaitingDiv from "../../components/waiting"
import CsvTable from "./csvtable"

export default class Upload extends Component {

  constructor(props) {
    super(props)
    this.state = {
      waiting: true,
      error: false,
      errorMessage: null,
      logged: this.props.location.state.logged,
      user: this.props.location.state.user,
      filesId: this.props.location.state.filesId,
      previewFiles: []
    }
    this.cancelRequest
  }

  componentDidMount() {
    if (!this.props.waitForStart) {
      let requestUrl = '/api/files/preview'
      let data = {
        filesId: this.state.filesId
      }
      axios.post(requestUrl, data, {cancelToken: new axios.CancelToken((c) => {this.cancelRequest = c})})
      .then(response => {
        console.log(requestUrl, response.data)
        this.setState({
          previewFiles: response.data.previewFiles,
          waiting: false,
          error: response.data.error,
          errorMessage: response.data.errorMessage,
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
  }

  componentWillUnmount() {
    if (!this.props.waitForStart) {
      this.cancelRequest()
    }
  }


  render() {

    let redirectLogin
    if (this.state.status == 401) {
      redirectLogin = <Redirect to="/login" />
    }

    return (
      <div className="container">
        {redirectLogin}
        <h2>Integrate</h2>
        <hr />


        {
          this.state.previewFiles.map(file => {
            console.log(file)
            if (file.type == 'csv/tsv') {
              return <CsvTable key={file.name} file={file} />
            }
          })
        }

        <WaitingDiv waiting={this.state.waiting} center="center" />
        <ErrorDiv status={this.state.status} error={this.state.error} errorMessage={this.state.errorMessage} />
      </div>
    )
  }
}
