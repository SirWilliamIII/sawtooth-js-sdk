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

const crypto = require('crypto')
const uuid = require('uuid/v4')
const zmq = require('zeromq')

const assert = require('assert')

const { Message } = require('../protobuf')
const deferred = require('./deferred')
const { ValidatorConnectionError } = require('../processor/exceptions')

const encodeMessage = (messageType, correlationId, content) => {
	assert(
		typeof messageType === 'number',
		`messageType must be a number -- was ${messageType}`
	)
	assert(
		typeof correlationId === 'string',
		`correlationId must be a string -- was ${correlationId}`
	)
	assert(
		content !== undefined || content !== null,
		'content must not be null or undefined'
	)
	assert(
		Buffer.isBuffer(content),
		`content must be a buffer -- was ${
			content.constructor ? content.constructor.name : typeof content
		}`
	)

	return Message.encode({
		messageType,
		correlationId,
		content
	}).finish()
}

const generateId = () =>
	crypto.crypto
		.createHash('sha256')
		.update(uuid())
		.digest('hex')

class Stream {
	constructor(url) {
		this.url = url
		this.initialConnection = true
	}

	connect(cb) {
		if (this.onConnect) {
			console.log(`Attempting to connect to ${this.url}`)
		}

		this.onConnect = cb
		this.futures = {}
		this.socket = zmq.socket('dealer')
		this.socket.setsockopt('identity', Buffer.from(uuid(), 'utf8'))
		this.socket.on('connect', () => {
			console.log(`Connected to ${this.url}`)
			onConnect()
		})

		this.socket.on('disconnect', (fd, endpt) => {
			this.handleDisconnect()
		})

		this.socket.monitor(250, 0)
		this.socket.connect(this.url)
		this.initialConnection = false
	}

	close() {
		this.socket.setsockopt(zmq.ZMQ_LINGER, 0)
		this.socket.unmonitor()
		this.socket.close()
		this.socket = null
	}

	handleDisconnect() {
		console.log(`Disconnected from ${this.url}`)
		this.close()
		Object.keys(this.futures).forEach(correlationId => {
			this.futures[correlationId].reject(
				new ValidatorConnectionError(
					'The connection to validator was lost'
				)
			)
		})
		this.connect(this.onConnect)
	}

	send(type, content) {
		if (this.socket) {
			const correlationId = generateId()
			let deferred = new Deferred()
			this.futures[correlationId] = deferred

			try {
				this.socket.send(encodeMessage(type, correlationId, content))
			} catch (e) {
				delete this.futures[correlationId]
				return Promise.reject(e)
			}

			return deferred.promise
				.then(result => {
					delete this.futures[correlationId]
					return result
				})
				.catch(err => {
					delete this.futures[correlationId]
					throw err
				})
		} else {
			let err = null
			if (this.initialConnection) {
				err = new Error('Must call `connect` before calling `send`')
			} else {
				err = new ValidatorConnectionError(
					'Connection to validator is lost'
				)
			}
			return Promise.reject(err)
		}
	}

	sendBack(type, correlationId, content) {
		if (this.socket) {
			this.socket.send(encodeMessage(type, correlationId, content))
		}
	}

	onReceive(cb) {
		this.socket.on('message', buffer => {
			let message = Message.decode(buffer)
			if (this.futures[message.correlationId]) {
				this.futures[message.correlationId].resolve(message.content)
			} else {
				process.nextTick(() => cb(message))
			}
		})
	}
}

module.exports = { Stream }
