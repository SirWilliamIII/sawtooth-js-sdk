/**
 * Copyright 2016 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

const {
	TpStateEntry,
	TpStateGetRequest,
	TpStateGetResponse,
	TpStateSetRequest,
	TpStateSetResponse,
	TpStateDeleteRequest,
	TpStateDeleteResponse,
	TpReceiptAddDataRequest,
	TpReceiptAddDataResponse,
	Event,
	TpEventAddRequest,
	TpEventAddResponse,
	Message
} = require('../protobuf')

const { AuthorizationException, InternalError } = require('../processor/exceptions')

const timeoutPromise = (p, millis) => {
	if(millis !== null && millis !== undefined) {
		return Promise.race([
			new Promise((resolve, reject) =>
				setTimeout(() => reject(Error('Timeout occurred'), millis))
			), p
		])
	} else {
		return p
	}
}

/*
 *  Context provides an interface for getting and setting validator
 *  state.
 *
 *  ALL validator interactions by a handler should be through
 *  a Context instance.
 */

class Context {
	constructor(stream, contextId) {
		this.stream = stream
		this.contextId = contextId
	}

	/**
	 * getState queries validator state for data at each of the
	 * addresses in the given list. The addresses that have been set are
	 * returned in a list.
	 *
	 * @param {string[]} addresses an array of addresses
	 * @param {null} [timeout] - an optional timeout
	 * @return a promise for a map of (address, buffer) pairs, where the
	 * buffer is the encoded value at the specified address
	 * @throws {AuthorizationException}
	 *
	 */

	getState(addresses, timeout=null) {
	}
	/**
	 *  setState requests that each address in the provided dictionary
	 *  be set in validator state to its corresponding value. A list is
	 *  returned containing the successfully set addresses.

	 *  @param {Object} addressValuePairs - a map of (address, buffer)
	 *   entries, where the buffer is the encoded value to be set at the
	 *   the given address.
	 *   @param {number} [timeout] - an optional timeout
	 *   @return a promise for the adddresses successfully set.
	 *   @throws {AuthorizationException}
	 */

	setState(addressValuePairs, timeout=null) {
	}

	/**
	 * deleteState requests that each of the provided addresses be
	 * unset in validator state. A list of successfully deleted
	 * addresses is returned.
	 *
	 * @param {string[]} addresses -  an array of addresses
	 * @param {number} [timeout] - an optional timeout
	 * @return a promise for the addresses successfully deleted.
	 * @throws {AuthorizationException}
	 */

	deleteState(addresses, timeout=null) {
	}

	/**
	 * Add a blob to the execution result for this transaction.
	 *
	 * @param {Buffer} data - the data to add
	 * @param {number} [timeout] - an optional timeout
	 * @return {Promise} a promise that resolves to nothing on success, or an
	 * error if the operation fails
	 */

	addReceiptData(data, timeout=null) {
	}

	/**
	 * Add a new event to the execution result for this transaction.
	 *
	 * @param {string} eventType - This is used to subscribe to events. It should
	 * be globally unique and describe what, in general, has occurred
	 * @param {string[][]} attributes - Additional information about the event that
	 * is transparent to the validator.  Attributes can be used by subscribers to
	 * filter the type of events they receive.
	 * @param {Buffer} data - Additional information about the event that is
	 * opaque to the validator.
	 * @param {number} [timeout] - an optional timeout
	 * @return {Promise} a promise that resolves to nothing on success, or an
	 * error if the operation fails
	 */

	addEvent(eventType, attributes, data, timeout=null) {
	}
}

module.exports = Context




