import { eventChannel } from 'redux-saga'
import { call, select, takeLatest, cancelled, takeEvery } from 'redux-saga/effects'

import { setListings } from '../actions'
import { selectRegistry, selectAllListings, selectProvider, selectVoting } from '../selectors'
import { getBlockAndTxnFromLog, decodeLog } from 'sagas/logs'
import { findGolem, findChallenge } from 'libs/listings'
import { SET_CONTRACTS } from '../actions/constants'

export default function* rootEventsSaga() {
  yield takeLatest(SET_CONTRACTS, eventsSaga)
  // yield takeLatest(SET_CONTRACTS, setupEventChannels)
}

export function* eventsSaga() {
  try {
    const provider = yield select(selectProvider)
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)

    registry.on_application = (listingHash, deposit, appEndDate, data) => {
      console.log('application', listingHash, deposit.toString(), appEndDate.toString(), data)
    }
    registry.on_challenge = (listingHash, challengeID, data) => {
      console.log('challenge', listingHash, challengeID.toString(), data)
    }
    registry.on_applicationwhitelisted = listingHash => {
      console.log('application whitelisted', listingHash)
    }
    registry.on_applicationremoved = listingHash => {
      console.log('application removed', listingHash)
    }
    registry.on_listingremoved = listingHash => {
      console.log('listing removed', listingHash)
    }
    registry.on_challengesucceeded = challengeID => {
      console.log('challenge succeeded', challengeID.toString())
    }
    registry.on_challengefailed = challengeID => {
      console.log('challenge failed', challengeID.toString())
    }

    voting.on_pollcreated = (voteQuorum, commitEndDate, revealEndDate, pollID) => {
      console.log(
        'poll created',
        commitEndDate.toString(),
        revealEndDate.toString(),
        pollID.toString()
      )
    }
    voting.on_votecommitted = (pollID, numTokens) => {
      console.log('vote committed', pollID.toString(), numTokens.toString())
    }
    voting.on_voterevealed = (pollID, numTokens, votesFor, votesAgainst) => {
      console.log(
        'vote revealed',
        pollID.toString(),
        numTokens.toString(),
        votesFor.toString(),
        votesAgainst.toString()
      )
    }
  } catch (error) {
    console.log('eventsSaga error:', error)
  }
}

// function* setupEventChannels() {
//   const provider = yield select(selectProvider)
//   const registry = yield select(selectRegistry)

//   // grab registry events
//   const { _Application } = registry.interface.events
//   // extract the topics
//   const aTopics = _Application.topics
//   // create channels for each event-topic
//   const aChannel = yield call(createChannel, provider, aTopics, _Application)

//   try {
//     while (true) {
//       yield takeEvery(aChannel, handleEventEmission)
//     }
//   } finally {
//     if (yield cancelled()) {
//       console.log('LISTENING CANCELLED')
//       aChannel.close()
//     }
//   }
// }

// eventChannel is a factory function that creates a Channel
// for events from sources other than the Redux store
// const createChannel = (provider, eventTopics, ContractEvent) =>
//   eventChannel(emitter => {
//     provider.removeAllListeners(eventTopics)
//     const event = provider.on(eventTopics, function(log) {
//       emitter({ ContractEvent, log })
//     })
//     return () => event.stopWatching()
//   })

// function createEventChannel(contract, event) {
//   return eventChannel(emitter => {
//     const event = contract.events[event] = (args) => {
//       emitter({})
//     }
//   })
// }

// function* handleEventEmission({ ContractEvent, log }) {
//   console.log('emit!')
//   console.log(ContractEvent.name, log)

//   const provider = yield select(selectProvider)
//   const listings = yield select(selectAllListings)

//   const { block, tx } = yield call(getBlockAndTxnFromLog, log, provider)
//   const txData = {
//     txHash: tx.hash,
//     blockNumber: block.number,
//     blockHash: block.hash,
//     ts: block.timestamp,
//   }
//   const dLog = yield call(decodeLog, ContractEvent, log)
//   console.log('dLog', dLog)

//   if (dLog.listingHash) {
//     const golem = yield call(findGolem, dLog.listingHash, listings)
//     console.log('golem', golem)
//     // const listing = yield call(changeListing, golem, ContractEvent.name, log, tx.from)
//     // console.log('listing', listing)
//     // const updatedListings = listings.set(log.listingHash, fromJS(listing))
//     // console.log('updatedListings', updatedListings.toJS())
//     // yield put(setListings(updatedListings))
//   } else if (dLog.pollID) {
//     const golem = yield call(findChallenge, dLog.pollID, listings)
//     console.log('golem', golem)
//   }
// }
