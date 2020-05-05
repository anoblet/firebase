import firebase from "firebase/app";
import { mapSnapshotToArray } from "./utility";
export { Collection } from "./collection";
let appInitializedResolve;
const appInitializedPromise = new Promise((resolve) => {
    appInitializedResolve = resolve;
});
const firestoreInitializedPromise = new Promise(async (resolve) => {
    await appInitializedPromise;
    await import("firebase/firestore");
    await enablePersistance();
    resolve();
});
/**
 * Initialize the firebase app
 * @param  config Configuration object
 * @return void
 */
export const initialize = async (config) => {
    if (firebase.apps.length === 0)
        firebase.initializeApp(config);
    else
        firebase.apps[0];
    appInitializedResolve();
};
export const enablePersistance = () => {
    return firebase
        .firestore()
        .enablePersistence()
        .catch(function (err) {
        if (err.code == "failed-precondition") {
            console.log("failed-precondition");
        }
        else if (err.code == "unimplemented") {
            console.log("unimplemented");
        }
    });
};
export const addDocument = async (path, data) => {
    await firestoreInitializedPromise;
    return firebase
        .firestore()
        .collection(path)
        .add(data)
        .then((docRef) => {
        // Should we return an id or the whole document with the id?
        return docRef.id;
    })
        .catch((error) => {
        return new Error("Unable to add document");
    });
};
export const getDocument = async (path, options) => {
    await firestoreInitializedPromise;
    const document = firebase.firestore().doc(path);
    const data = document.get().then((doc) => doc.data());
    // If a callback was given, assume we want to watch for changes
    if (options && options.callback)
        document.onSnapshot((doc) => {
            const data = doc.data();
            data.id = doc.id;
            options.callback(data);
        });
    return data;
};
export const updateDocument = async (path, data) => {
    await firestoreInitializedPromise;
    return firebase
        .firestore()
        .doc(path)
        .set(data, { merge: true })
        .then((docRef) => true)
        .catch((error) => false);
};
export const deleteDocument = async (path) => {
    await firestoreInitializedPromise;
    return firebase.firestore().doc(path).delete();
};
export const getCollection = async (path, options) => {
    await firestoreInitializedPromise;
    let collection = firebase.firestore().collection(path);
    if (options && options.where) {
        collection = collection.where(options.where.property, options.where.operator, options.where.value);
    }
    if (options && options.orderBy)
        collection = collection.orderBy(options.orderBy);
    // Grab data irregardless
    const data = collection.get().then((querySnapshot) => {
        return mapSnapshotToArray(querySnapshot);
    });
    // If a callback was given, assume we want to watch for changes
    if (options && options.callback) {
        collection.onSnapshot((querySnapshot) => {
            const data = mapSnapshotToArray(querySnapshot);
            options.callback(data);
        });
    }
    return data;
};
const getUser = async () => {
    await import("firebase/auth");
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            resolve(user);
        });
    });
};
