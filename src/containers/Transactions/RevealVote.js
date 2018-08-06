import React, { Component } from 'react'

import Button from 'components/Button'
import { MarginDiv } from 'components/StyledHome'

import { SideSplit, SideText } from 'containers/Transactions/components'

import { baseToConvertedUnit } from 'libs/units'
import { getLocal } from 'utils/_localStorage'

import { TransactionsContext } from './index'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import DetailsSection from './components/DetailsSection'
import ProgressBar from './ProgressBar.js'
import { IoIosThumbsDown, IoIosThumbsUp } from 'react-icons/io'

export default class RevealVote extends Component {
  state = {
    value: 60,
    voting: 'Current Votes',
    ticket: {
      numTokens: '',
    },
    successPercentage: 0,
    successValue: 0,
    dangerPercentage: 0,
    dangerValue: 0,
  }

  componentDidMount() {
    this.handleGetLocal()
    this.setState(this.getVoteResults(this.props.selectedOne))
  }

  handleGetLocal = async () => {
    const listing = this.props.selectedOne
    const key = `${listing.challengeID}-${listing.listingID}`
    const localFile = await getLocal(key)
    console.log('localFile:', localFile)

    if (localFile) {
      this.setState({
        ticket: localFile.ticket,
      })
    }
  }

  getVoteResults = selectedOne => {
    console.log(selectedOne)
    const successValue = parseInt(selectedOne.votesFor) / 1000000000000000000
    const dangerValue = parseInt(selectedOne.votesAgainst) / 1000000000000000000
    const totalVotes = successValue + dangerValue

    const successPercentage = successValue / totalVotes * 100
    const dangerPercentage = 100 - successPercentage

    return {
      successValue,
      successPercentage: successPercentage ? successPercentage : 0,
      dangerValue,
      dangerPercentage: dangerPercentage ? dangerPercentage : 0,
    }
  }

  render() {
    return (
      <TransactionsContext.Consumer>
        {({
          closeSidePanel,
          selectedOne,
          opened,
          balances,
          handleFileInput,
          onSendTx,
          tcr,
        }) => (
          <SidePanel title="Reveal Vote" opened={true} onClose={closeSidePanel}>
            <DetailsSection listing={selectedOne} />

            <SidePanelSeparator />

            {/* <FileInput type="file" name="file" onChange={handleFileInput} /> */}
            {this.state.ticket.voteOption ? (
              <MarginDiv>
                <SideText
                  small
                  text={`Reveal for vote: ${selectedOne && selectedOne.listingID}`}
                />

                <div>
                  {' '}
                  You committed {this.state.ticket.numTokens / 1000000000000000000} tokens
                  for{' '}
                  {this.state.ticket.voteOption === '0' ? (
                    <IoIosThumbsDown color={'red'} />
                  ) : (
                    <IoIosThumbsUp color={'green'} />
                  )}
                </div>

                <MarginDiv>
                  <div>
                    {this.state.voting}: {this.state.successPercentage.toFixed(2)}% for,{' '}
                    {this.state.dangerPercentage.toFixed(2)}% against
                  </div>
                </MarginDiv>
                <MarginDiv>
                  <ProgressBar
                    successPercentage={this.state.successPercentage}
                    successValue={this.state.successValue}
                    dangerValue={this.state.dangerValue}
                    dangerPercentage={this.state.dangerPercentage}
                    revealVoteEnded={this.props.revealVoteEnded}
                  />
                </MarginDiv>
                <div>Your Balance: userBalance</div>

                <Button
                  methodName="revealVote"
                  onClick={() => onSendTx('revealVote', this.state.ticket)}
                  mode="strong"
                  wide
                >
                  {'Reveal Vote'}
                </Button>
              </MarginDiv>
            ) : (
              <div>
                <SideText text={'You have not committed to this poll'} />
                <MarginDiv>
                  <div>
                    {this.state.voting}: {this.state.successPercentage.toFixed(2)}% for,{' '}
                    {this.state.dangerPercentage.toFixed(2)}% against
                  </div>
                  <ProgressBar
                    successPercentage={this.state.successPercentage}
                    successValue={this.state.successValue}
                    dangerValue={this.state.dangerValue}
                    dangerPercentage={this.state.dangerPercentage}
                    revealVoteEnded={this.props.revealVoteEnded}
                  />
                </MarginDiv>
                <div>Your Balance: userBalance</div>
              </div>
            )}
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}
