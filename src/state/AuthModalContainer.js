import { Container } from 'unstated'

import {
	SOCIAL_AUTH_MODAL_BODY,
	SOCIAL_AUTH_MODAL_OPEN,
	SOCIAL_AUTH_MODAL_TITLE,
	SOCIAL_AUTH_MODAL_LOADER,
	SOCIAL_AUTH_MODAL_CALLBACK,
} from 'constantValues'

const defaultValues = {
	[SOCIAL_AUTH_MODAL_BODY]: '',
	[SOCIAL_AUTH_MODAL_TITLE]: '',
	[SOCIAL_AUTH_MODAL_OPEN]: false,
	[SOCIAL_AUTH_MODAL_LOADER]: false,
	[SOCIAL_AUTH_MODAL_CALLBACK]: () => {},
}

class AuthModalContainer extends Container {
	state = defaultValues

	toggle = () => {
		return this.setState(state => {
			state[SOCIAL_AUTH_MODAL_OPEN] = !state[SOCIAL_AUTH_MODAL_OPEN]
			return state
		})
	}
	resetState = () => {
		return this.setState(defaultValues)
	}
}

export default AuthModalContainer
