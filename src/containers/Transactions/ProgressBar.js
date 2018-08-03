import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Progress } from 'reactstrap'

export default class ProgressBar extends Component {
  animatedBar() {
    return (
      <div>
        <Progress animated color="success" value={this.props.successPercentage}>
          {this.props.successValue}
        </Progress>
        <br />
        <Progress animated color="danger" value={this.props.dangerPercentage}>
          {this.props.dangerValue}
        </Progress>
      </div>
    )
  }

  plainBar() {
    return (
      <div>
        <Progress color="success" value={this.props.successPercentage}>
          {this.props.successValue}
        </Progress>
        <br />
        <Progress color="danger" value={this.props.dangerPercentage}>
          {this.props.dangerValue}
        </Progress>
      </div>
    )
  }

  render() {
    return this.props.revealVoteEnded ? this.plainBar() : this.animatedBar()
  }
}
