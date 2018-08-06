import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Progress } from 'reactstrap'
import styled from 'styled-components'

import { IoIosThumbsDown, IoIosThumbsUp } from 'react-icons/io'

const FlexContainer = styled.div`
  display: flex;
  margin-top: 1em;
  & > div {
    width: 100%;
  }
`
export default class ProgressBar extends Component {
  animatedBar() {
    return (
      <div>
        <FlexContainer>
          <IoIosThumbsUp color={'green'} />
          <Progress animated color="success" value={this.props.successPercentage}>
            {this.props.successValue}
          </Progress>
        </FlexContainer>

        <FlexContainer>
          <IoIosThumbsDown color={'red'} />
          <Progress animated color="danger" value={this.props.dangerPercentage}>
            {this.props.dangerValue}
          </Progress>
        </FlexContainer>
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
    return this.props.revealVoteEnded ? null : this.animatedBar()
  }
}
