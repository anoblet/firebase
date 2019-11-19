import firebase from 'firebase/app';

const mapSnapshotToArray = (snapshot) => {
    const result = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        result.push(data);
    });
    return result;
};

/**
 * Initialize the firebase app
 * @param  config Configuration object
 * @return void
 */
const initialize = config => {
    if (firebase.apps.length === 0)
        firebase.initializeApp(config);
    else
        firebase.apps[0];
    enablePersistance();
};
const enablePersistance = async () => {
    await import('firebase/firestore');
    firebase
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
const addDocument = async (path, data) => {
    await import('firebase/firestore');
    return firebase
        .firestore()
        .collection(path)
        .add(data)
        .then((docRef) => {
        // Should we return an id or the whole document with the id?
        return docRef.id;
    })
        .catch(error => {
        return new Error("Unable to add document");
    });
};
const getDocument = async (path, options) => {
    await import('firebase/firestore');
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
const updateDocument = async (path, data) => {
    return firebase
        .firestore()
        .doc(path)
        .set(data, { merge: true });
};
const deleteDocument = async (path) => {
    return firebase
        .firestore()
        .doc(path)
        .delete();
};
const getCollection = async (path, options) => {
    // Import dependencies
    await import('firebase/firestore');
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
    await import('firebase/auth');
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            resolve(user);
        });
    });
};
class Firebase {
    constructor(config) {
        this.init = initialize;
        this.addDocument = addDocument;
        this.getDocument = getDocument;
        this.updateDocument = updateDocument;
        this.deleteDocument = deleteDocument;
        this.getCollection = getCollection;
        this.getUser = getUser;
        this.init(config);
    }
}

export { Firebase, addDocument, deleteDocument, enablePersistance, getCollection, getDocument, initialize, updateDocument };