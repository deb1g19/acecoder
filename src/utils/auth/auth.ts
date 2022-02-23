/* eslint-disable no-ex-assign */
import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut as _signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	sendPasswordResetEmail
} from 'firebase/auth';
import { browser } from '$app/env';
import type { AuthProvider, AuthError as _AuthError } from 'firebase/auth';
import { auth, db } from '../firebase';
import type { AuthError } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AuthFederation = 'google' | 'github';
const DASHBOARD_URL = '/dashboard';
const LOGIN_URL = '/login';

/**
 * Helper methods for interacting with Firebase authentication.
 * @returns The authentication library
 */

onAuthStateChanged(
	auth,
	(user) => {
		if (
			browser &&
			!user &&
			!window.location.href.match('.+/(login|certificate|profile|register)')
		) {
			window.location.href = LOGIN_URL;
		}
	},
	(err) => console.error(err.message)
);

/**
 * Register a new user to the application.
 *
 * @param email The new user's email
 * @param password The new user's password
 * @returns An auth error if registering failed
 */
export const register = async (
	email: string,
	password: string,
	name: string
): Promise<AuthError | void> => {
	try {
		await createUserWithEmailAndPassword(auth, email, password);
		await saveName(name);
		window.location.href = DASHBOARD_URL;
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

const saveName = async (name: string): Promise<void> => {
	if (!auth.currentUser) throw new Error('You need to be logged in to perform that action');
	if (name.length == 0) throw new Error('Name cannot be empty');
	await setDoc(doc(db, 'names', auth.currentUser.uid), { name: name });
};

export const signIn = async (email: string, password: string): Promise<AuthError | void> => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		window.location.href = DASHBOARD_URL;
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

export const signInWith = async (
	federation: AuthFederation,
	registering = false
): Promise<AuthError | void> => {
	// Get the relevant authentication provider.
	let provider: AuthProvider;
	switch (federation) {
		case 'google':
			provider = new GoogleAuthProvider();
			break;
		case 'github':
			provider = new GithubAuthProvider();
			break;
	}

	// Trigger the federated sign in popup.
	try {
		await signInWithPopup(auth, provider);
		if (auth.currentUser) {
			if (registering) {
				let name = '';

				if (auth.currentUser.displayName) {
					name = auth.currentUser.displayName;
				} else if (auth.currentUser.email) {
					name = auth.currentUser.email;
				}
				await saveName(name);
			}
			window.location.href = DASHBOARD_URL;
		}
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

export const signOut = async (): Promise<AuthError | void> => {
	try {
		await _signOut(auth);
		window.location.href = LOGIN_URL;
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

export const isAdmin = async (): Promise<boolean> => {
	const user = auth.currentUser;
	if (!user) return false;
	const token = await user.getIdTokenResult();
	return !!token.claims.admin;
};

export const resetPassword = async (email: string): Promise<AuthError | void> => {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

export const getName = async (uid: string, full = false): Promise<string> => {
	const snapshot = await getDoc(doc(db, 'names', uid));
	if (snapshot.exists()) {
		const name = snapshot.data()['name'];
		return full ? name : name.split(' ')[0];
	}
	return '';
};

export const getErrorMessage = (firebaseError: AuthError): AuthError | undefined => {
	switch (firebaseError.errorCode) {
		case 'auth/wrong-password':
			return {
				errorCode: 'Incorrect password',
				errorMessage: 'Please check your password and try again.'
			};
		case 'auth/invalid-email':
			return {
				errorCode: 'Invalid email',
				errorMessage: 'Please provide a valid email address.'
			};
		case 'auth/invalid-password':
			return {
				errorCode: 'Invalid password',
				errorMessage:
					'Please provide a valid password. It must be a string with at least six characters.'
			};
		case 'auth/user-not-found':
			return {
				errorCode: 'Invalid email',
				errorMessage: 'No user could be found with that email address.'
			};
		case 'auth/popup-closed-by-user':
			return;
		default:
			return {
				errorCode: 'Unknown error',
				errorMessage: 'An unknown error occurred. Please try again later.'
			};
	}
};
