const crypto = require('crypto')
const uuid = require('uuid/v4')
const zmq = require('zeromq')

const assert = require('assert')


class Stream {
	constructor(url) {
		this.url = url
		this.initialConnection = true
	}

	connect(cb) {
		if(this.onConnect) {
			console.log(`Attempting to connect to ${this.url}`)
		}

		this.onConnect = cb
		this.futures = {}
		this.socket 
	}
}