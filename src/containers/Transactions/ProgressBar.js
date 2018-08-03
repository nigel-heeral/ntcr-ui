import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Progress } from 'reactstrap'

export default class ProgressBar extends Component {
  animatedBar() {
    return (
      <Progress multi>
        <Progress animated bar color="success" value={this.props.successPercentage}>
          {this.props.successValue}
        </Progress>
        <Progress animated bar color="danger" value={this.props.dangerPercentage}>
          {this.props.dangerValue}
        </Progress>
      </Progress>
    )
  }

  plainBar() {
    return (
      <Progress multi>
        <Progress bar color="success" value={this.props.successPercentage}>
          {this.props.successValue}
        </Progress>
        <Progress bar color="danger" value={this.props.dangerPercentage}>
          {this.props.dangerValue}
        </Progress>
      </Progress>
    )
  }

  render() {
    return this.props.revealVoteEnded ? this.plainBar() : this.animatedBar()
  }
}
