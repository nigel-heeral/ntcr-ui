import React, { Component } from 'react'
import styled from 'styled-components'

import Button from 'components/Button'
import Img from 'components/Img'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import Radio from 'components/Radio'
import { TransactionsContext } from './index'

import leftArrowIcon from 'assets/icons/left-arrow.svg'
// import rightArrowIcon from 'assets/icons/right-arrow-thin.svg'

// import thumbsUpIcon from 'assets/icons/thumbs-up.svg'
import thumbsDownIcon from 'assets/icons/thumbs-down.svg'
import likeIcon from 'assets/icons/like.svg'
// import dislikeIcon from 'assets/icons/dislike.svg'

import { randomSalt } from 'libs/values'
import { getLocal, saveLocal } from 'utils/_localStorage'

const SidePanelWrapper = styled.div`
  font-family: 'Avenir Next';
`
const DetailsSection = styled.div`
  display: flex;
  padding: 2em 0;
`
const ListingIconSquare = styled.div`
  height: 90px;
  width: 90px;
  border: 1px solid black;
`
const ListingInfoColumn = styled.div`
  margin-left: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 1.2em;
`
const ListingTitle = styled.div`
  font-weight: 600;
`
const ListingCountdown = styled.div`
  color: #fb8414;
  font-weight: 500;
`

const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
`
const ActionStepRow = styled.div`
  margin-top: 2em;
`
const ActionTitle = styled.div`
  margin-left: 1em;
  font-weight: 550;
`
const ActionInstructions = styled.div`
  padding: 1.2em 1.5em;
  color: #788995;
`
const SupportCandidate = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0.8em 2em;
  margin: 10px 0;
  border: 1px solid #dde3e8;
  border-radius: 3px;
  background-color: #ffffff;
  font-size: 1.25em;
`
const OpposeCandidate = SupportCandidate.extend``
const ThumbIcon = styled.div`
  width: 20px;
  margin-left: 8em;
  & > div > img {
    background-color: black;
  }
`
const InputFormRow = styled.div`
  display: flex;
  box-sizing: border-box;
  background-color: #ffffff;
`
const InputNumTokens = styled.input`
  width: 80%;
  padding: 0.8em 1.2em;
  font-size: 1em;
  border: 1px solid #71b6ef;
  border-right: 1px solid #dde3e8;
  border-radius: 3px 0 0 3px;
`
const NumTokensButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  padding: 1.2em 2em;
  color: #71b6ef;
  border: 1px solid #71b6ef;
  border-left: none;
  border-radius: 0 3px 3px 0;
  font-size: 0.9em;
  font-weight: 700;
`
const DownloadTicket = styled.div``
const ReturnToRegistry = styled.div`
  display: flex;
  margin-top: 1em;
`
const ArrowIcon = styled.div`
  width: 20px;
  margin-right: 5px;
`
class CommitVote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
      voteOption: '',
      salt: randomSalt(),
    }
  }

  previousStep() {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }))
  }
  nextStep() {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }))
  }

  handleChangeVoteOption = event => {
    this.setState({ voteOption: event.target.value })
  }

  // const key = `${pollID}-${listingID}`
  checkLocal = async key => {
    const local = await getLocal(key)
    if (!local) {
      console.log('nothing in local storage for key:', key)
    } else {
      this.nextStep()
    }
  }

  render() {
    return (
      <SidePanelWrapper>
        <TransactionsContext.Consumer>
          {({
            needToApproveVoting,
            selectedOne,
            closeSidePanel,
            handleApprove,
            handleCommitVote,
            handleInputChange,
            opened,
          }) => (
            <SidePanel
              title="Commit Your Vote"
              opened={opened === 'commitVote'}
              onClose={closeSidePanel}
            >
              {/* <ArrowIcon>
            <Img src={rightArrowIcon} />
          </ArrowIcon> */}
              <SidePanelSeparator />

              <DetailsSection>
                <ListingIconSquare>
                  {selectedOne.listingData && (
                    <Img src={selectedOne.listingData} alt="" />
                  )}
                </ListingIconSquare>

                <ListingInfoColumn>
                  <ListingTitle>{selectedOne.listingID}</ListingTitle>

                  <ListingCountdown>
                    <div>Vote Ends In</div>
                    <div>00 : 20 : 00</div>
                  </ListingCountdown>
                </ListingInfoColumn>
              </DetailsSection>
              <SidePanelSeparator />

              <ActionsSection>
                <ActionStepRow>
                  <ActionTitle>{'CHOOSE YOUR SIDE'}</ActionTitle>
                  <SupportCandidate>
                    <Radio
                      on={true}
                      // checked={this.state.voteOption === '1'}
                      // onChange={this.handleChangeVoteOption}
                      value="1"
                      color="primary"
                      handleCheckRadio={this.handleChangeVoteOption}
                    />
                    {'Support'}
                    <ThumbIcon>
                      <Img alt="like" src={likeIcon} />
                    </ThumbIcon>
                  </SupportCandidate>
                  <OpposeCandidate>
                    Oppose
                    <ThumbIcon>
                      <Img alt="dislike" src={thumbsDownIcon} />
                    </ThumbIcon>
                  </OpposeCandidate>
                </ActionStepRow>

                <ActionStepRow>
                  <ActionTitle>TOKENS TO COMMIT</ActionTitle>
                  <ActionInstructions>
                    Please enter the amount of tokens you wish to commit to your vote
                  </ActionInstructions>

                  <InputFormRow>
                    <InputNumTokens onChange={e => handleInputChange(e, 'numTokens')} />
                    <NumTokensButton>NEXT</NumTokensButton>
                  </InputFormRow>
                </ActionStepRow>

                <ActionStepRow>
                  <ActionTitle>GENERATE TICKET TO REVEAL</ActionTitle>
                  <DownloadTicket />
                  <Button
                    onClick={() =>
                      handleCommitVote(
                        this.state.voteOption,
                        this.state.salt,
                        selectedOne
                      )
                    }
                  >
                    SUBMIT
                  </Button>
                </ActionStepRow>
              </ActionsSection>

              <ReturnToRegistry>
                <ArrowIcon>
                  <Img alt="goback" src={leftArrowIcon} />
                </ArrowIcon>
                Go back to registry
              </ReturnToRegistry>
            </SidePanel>
          )}
        </TransactionsContext.Consumer>
      </SidePanelWrapper>
    )
  }
}

export default CommitVote