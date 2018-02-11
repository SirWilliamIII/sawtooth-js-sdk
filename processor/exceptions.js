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

class TransactionProcessorError extends Error {
	constructor(message = '', extendedData = null) {
		super(message)
		this.name = this.constructor.name
		if(extendedData) {
			if(Buffer.isBuffer(extendedData) || extendedData instanceof Uint8Array) {
				this.extendedData = extendedData
			} else {
				throw new TypeError('Extended data must be Buffer or Uint8Array')
			}
		}
	}
}

//  Thrown for Invalid Transaction
class InvalidTransaction extends TransactionProcessorError {
	/**
	 * Constructs a new InvalidTransaction.
	 *
	 * @param {string} [message] - an optional message, defaults to the empty
	 * string
	 * @param {Buffer|Uint8Array} [extendedData] - optional, application-specific
	 * serialized data to returned to the transaction submitter.
	 */
	constructor(message, extendedData) {
		super(message, extendedData)
		this.name = this.constructor.name
	}
}

//  Thrown on internal error during transaction processing

class InternalError extends TransactionProcessorError {
	/**
	 * Constructs a new InternalError
	 * @param {string} [message] - an optional message, defaults to the empty
	 * string
	 * @param {Buffer|Uint8Array} [extendedData] - optional, application-specific
	 * serialized data to returned to the transaction submitter.
	 */
	constructor(message, extendedData) {
		super(message, extendedData)
		this.name = this.constructor.name
	}
}

//  Thrown on connection error between validator and transaction processor
class ValidatorConnectionError extends Error {
	/**
	 * Constructs a new ValidatorConnectionError
	 *
	 * @param {string} [message] - an optional message, defaults to the empty
	 * string
	 */
	constructor(message = '') {
		super(message)
		this.name = this.constructor.name
	}
}

//  Thrown on Auth error
class AuthorizationException extends Error {
	/**
	 * Constructs a new AuthorizationException
	 *
	 * @param {string} [message] - an optional message, defaults to the empty
	 * string
	 */
	constructor(message = '') {
		super(message)
		this.name = this.constructor.name
	}
}

module.exports = {
	InvalidTransaction,
	InternalError,
	ValidatorConnectionError,
	AuthorizationException
}

