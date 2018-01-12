import {
  call,
  put,
  fork,
  takeEvery,
} from 'redux-saga/effects'
import {
  TX_APPLY,
  TX_CHALLENGE,
  TX_UPDATE_STATUS,
  TX_CHECK_TEST,
} from '../actions/constants'
import { getRegistry, getContract } from '../services';

import {
  contractError,
} from '../actions'

import logsSaga from './logs'
import { tokensAllowedSaga } from './token'

export default function* registrySaga() {
  yield fork(logsSaga)
  yield takeEvery(TX_APPLY, applicationSaga)
  yield takeEvery(TX_CHALLENGE, challengeSaga)
  yield takeEvery(TX_UPDATE_STATUS, updateStatusSaga)
  yield takeEvery(TX_CHECK_TEST, checkTestSaga)
}


// Registry interactions

// Apply
function* applicationSaga(payload) {
  const registry = yield call(getRegistry)
  const token = yield call(getContract, 'token')

  try {
    const applied = yield call(
      registry.applyListing,
      payload.listing,
      payload.deposit,
      token.decimalPower
    )
    console.log('applied', applied)
  } catch (err) {
    console.log('Apply error:', err)
    yield put(contractError(err))
  }
  yield call(tokensAllowedSaga, registry.address)
}

// Challenge
function* challengeSaga(payload) {
  const registry = yield call(getRegistry)
  try {
    const hash = yield call([registry, 'challengeListing'], payload.listing)
    console.log('hash', hash)
    yield call(tokensAllowedSaga, registry.address)
  } catch (err) {
    console.log('Challenge error:', err)
    yield put(contractError(err))
  }
}

function* checkTestSaga(payload) {
  const registry = yield call(getRegistry)
  const receipt = yield call([registry, 'checkCall'], 'challengeExists', payload.listing)
  console.log('receipt', receipt)
  yield call(tokensAllowedSaga, registry.address)
}

function* updateStatusSaga(payload) {
  const registry = yield call(getRegistry)
  const receipt = yield call(registry.updateStatus, payload.listing)
  console.log('receipt', receipt)
  yield call(tokensAllowedSaga, registry.address)
}