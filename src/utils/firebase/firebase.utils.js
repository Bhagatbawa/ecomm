import {initializeApp} from 'firebase/app';
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

} from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs
} from'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA0YGvVZfj_EpoY2Wuiv5RIvvQNiY9wL0I",
    authDomain: "cwrn-clothing-bb51e.firebaseapp.com",
    projectId: "cwrn-clothing-bb51e",
    storageBucket: "cwrn-clothing-bb51e.appspot.com",
    messagingSenderId: "1001288960223",
    appId: "1:1001288960223:web:3a2098ef13c5435a54c16a"
  };
  
  
  const firebaseApp = initializeApp(firebaseConfig);

  const googleProvider = new GoogleAuthProvider();

  googleProvider.setCustomParameters({
    prompt:'select_account',
  });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth,googleProvider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth,googleProvider);

  export const db = getFirestore();

  export const addCollectionAndDocuments = async (collectionkey,objectsToAdd) => {
    const collectionRef= collection(db,collectionkey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef,object.title.toLowerCase());
        batch.set(docRef,object);

    });
    await batch.commit();
    console.log('done');
  };

  export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db,'categories');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc,docSnapshot) => {
        const {title,items} = docSnapshot.data();
        acc[title.toLowerCase()] = items;
        return acc;
    },{});
    return categoryMap;
  }

  export const createUserDocumentFromAuth= async(userAuth,
    additionalInformation = {}) => {
    if(!userAuth) return;
    const userDocRef = doc (db,'users',userAuth.uid);

   
     const userSnapshot = await getDoc(userDocRef);
    

     if(!userSnapshot.exists()){
        const {displayName,email} = userAuth;
        const createdAt = new Date();
        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            });
         } catch (error) {
            console.log('error creating the user',error.message);
         }
         return userDocRef;
     };
};
     export const createAuthUserWithEmailAndPassword = async(email,password) => {
        if (!email || !password) return;
        return await createUserWithEmailAndPassword(auth,email,password)
     };
     export const signInAuthUserWithEmailAndPassword = async(email,password) => {
        if (!email || !password) return;
        return await signInWithEmailAndPassword(auth,email,password)
     };

     export const signOutUser = async () => await signOut(auth);


     export const onAuthStateChangedListener = (callback) => 
     onAuthStateChanged(auth,callback);
  

