import req from 'request-promise'
import { firebase, functions } from 'utils/firebaseBackEnd'

import {
	signUpEmailValidation,
	signUpPasswordValidation,
	signUpUsernameValidation,
} from 'utils/validation'
import { resObj } from 'utils/objects'
import { handleIsEmailExist } from 'api'

import {
	ENV,
	VERIFY_EMAIL_API_KEY,
	STATUS,
	EMAIL,
	PASSWORD,
	USERNAME,
	USER_DISPLAY_NAME,
	USER_PHOTO_URL,
	DEFAULT_AVATAR_URL,
} from 'constantValues'

const {
	[ENV]: { [VERIFY_EMAIL_API_KEY]: verify_email_api_key },
} = functions.config()

const handleSignUpWithEmailAndPassword = async data => {
	const { [EMAIL]: email, [PASSWORD]: password, [USERNAME]: username } = data
	try {
		const usernameInvalid = await signUpUsernameValidation(username)
			.then(() => '')
			.catch(result => result.errors)
		const emailInvalid = await signUpEmailValidation(email)
			.then(() => '')
			.catch(result => result.errors)
		const passwordInvalid = await signUpPasswordValidation(password)
			.then(() => '')
			.catch(result => result.errors)

		if (usernameInvalid || emailInvalid || passwordInvalid) {
			return resObj(false, 'Internal Error Code 2', 2, {
				[USERNAME]: usernameInvalid,
				[EMAIL]: emailInvalid,
				[PASSWORD]: passwordInvalid,
			})
		}
		const isEmailNew = await handleIsEmailExist(data)

		if (!isEmailNew[STATUS]) {
			return isEmailNew
		}

		const isEmailReal = await req(`${verify_email_api_key}${email}`)
			.then(res => {
				const data = JSON.parse(res)
				if (data[STATUS] === 1) {
					return resObj(true)
				} else {
					return resObj(false, 'Invalid Email', 3, { [EMAIL]: 'Invalid Email' })
				}
			})
			.catch(err => {
				console.log('email verifying error', err)
				return resObj(false, 'Internal Error Code 4', 4, {
					[EMAIL]: 'Internal Error Code 4',
				})
			})

		if (!isEmailReal[STATUS]) {
			return isEmailReal
		}

		return firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(credential => {
				if (credential.user && credential.user.emailVerified === false) {
					credential.user.sendEmailVerification().catch(err => {
						console.log('email user failed', err)
					})
					credential.user
						.updateProfile({
							[USER_DISPLAY_NAME]: username,
							[USER_PHOTO_URL]: functions.config()[ENV][DEFAULT_AVATAR_URL],
						})
						.catch(err => {
							console.log('update username failed', err)
						})
				}
				return resObj(true)
			})
			.catch(err => {
				console.log('submit error', err)
				return resObj(false, 'Internal Error Code 5', 5)
			})
	} catch (err) {
		console.log(err)
		return resObj(false, 'Internal Error Code 6', 6)
	}
}

export default handleSignUpWithEmailAndPassword
