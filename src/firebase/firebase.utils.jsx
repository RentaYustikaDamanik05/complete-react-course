import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyAhftEMRzkicn94qPxY3Ij17wSSmHZBgRQ",
  authDomain: "crwn-db-91963.firebaseapp.com",
  projectId: "crwn-db-91963",
  storageBucket: "crwn-db-91963.appspot.com",
  messagingSenderId: "189297717963",
  appId: "1:189297717963:web:0affa174324ffc609a614e",
  measurementId: "G-HN6VYLJ1GJ"
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  // Get a reference to the place in the database where the user is stored
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('error creating user', error.message);
    }
  }

  return getUserDocumentRef(userAuth.uid);
};

export const getUserDocumentRef = async uid => {
  if (!uid) return null;

  try {
    return firestore.doc(`users/${uid}`);
  } catch (error) {
    console.error('error fetching user', error.message);
  }
};

export default firebase;
