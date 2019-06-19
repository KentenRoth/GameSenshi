import React from 'react'

import { Row, Col, Alert } from 'reactstrap'
import { STATUS, MESSAGE } from 'constantValues'

const MessageList = (
	props,
	duplicatedErrorMessages = [],
	popoverItemFailed = { items: {} }
) => {
	const { validationResult, type } = props
	// if validationResult is undefined, it passed validation
	// if validationResult is {status:true/false, message:string/array of string} and if the status is true, it passed validation
	// if validationResult is string or array of string, it failed validation
	const isObj = validationResult && validationResult[STATUS]
	const messages = isObj
		? Array.isArray(validationResult[MESSAGE])
			? validationResult[MESSAGE]
			: [validationResult[MESSAGE]]
		: Array.isArray(validationResult)
		? validationResult
		: [validationResult]

	popoverItemFailed.items = {} // reset

	const filteredMessages = messages.filter(message => {
		popoverItemFailed.items[message] = true
		return !duplicatedErrorMessages.includes(message)
	})

	return (
		validationResult &&
		filteredMessages.map(filteredMessage => {
			return (
				<Alert
					className={'mb-1 pb-0 pt-0'}
					color='danger'
					key={filteredMessage}
					style={{
						backgroundColor: 'transparent',
					}}
					// due to limitation of final form, we cannot use fade without sacrificing UX (flicking)
					// it is very difficult to fix the flicking(but possible, need more control)
					fade={false} //https://github.com/reactstrap/reactstrap/pull/1078
				>
					<Row>
						{type === 'checkbox' && (
							<Col
								className={'col-1'} // indent for checkbox
							/>
						)}
						<Col className='col-1'>
							<i
								className={`text-success tim-icons ${
									validationResult[STATUS]
										? 'icon-check-2'
										: 'icon-alert-circle-exc'
								}`}
							/>
						</Col>
						<Col className={type === 'checkbox' ? 'col-10' : 'col-11'}>
							<small className='text-muted'>{filteredMessage}</small>
						</Col>
					</Row>
				</Alert>
			)
		})
	)
}

export default MessageList
