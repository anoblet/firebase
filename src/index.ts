import firebase from "firebase/app";
import { config } from "./types";
import { mapSnapshotToArray } from "./utility";

/**
 * Initialize the firebase app
 * @param  config Configuration object
 * @return void
 */
export const initialize = config => {
  if (firebase.apps.length === 0) firebase.initializeApp(config);
  else firebase.apps[0];
  enablePersistance();
};

export const enablePersistance = async () => {
  await import("firebase/firestore");
  firebase
    .firestore()
    .enablePersistence()
    .catch(function(err) {
      if (err.code == "failed-precondition") {
        console.log("failed-precondition");
      } else if (err.code == "unimplemented") {
        console.log("unimplemented");
      }
    });
};

export const addDocument = async (path: string, data: {}) => {
  await import("firebase/firestore");
  return firebase
    .firestore()
    .collection(path)
    .add(data)
    .then((docRef: any) => {
      // Should we return an id or the whole document with the id?
      return docRef.id;
    })
    .catch(error => {
      return new Error("Unable to add document");
    });
};

export const getDocument = async (path: string, options?: { callback? }) => {
  await import("firebase/firestore");
  const document = firebase.firestore().doc(path);
  const data = document.get().then((doc: any) => doc.data());
  // If a callback was given, assume we want to watch for changes
  if (options && options.callback)
    document.onSnapshot((doc: any) => {
      const data = doc.data();
      data.id = doc.id;
      options.callback(data);
    });
  return data;
};

export const updateDocument = async (path: string, data: {}) => {
  return firebase
    .firestore()
    .doc(path)
    .set(data, { merge: true })
    .then((docRef: any) => true)
    .catch(error => false);
};

export const deleteDocument = async (path: string) => {
  return firebase
    .firestore()
    .doc(path)
    .delete();
};

export const getCollection = async (
  path: string,
  options?: {
    callback?: (data: {}) => {};
    orderBy?: string;
    where?: {
      property: string;
      operator: any;
      value: boolean | string;
    };
  }
) => {
  // Import dependencies
  await import("firebase/firestore");
  let collection: any = firebase.firestore().collection(path);
  if (options && options.where) {
    collection = collection.where(
      options.where.property,
      options.where.operator,
      options.where.value
    );
  }
  if (options && options.orderBy)
    collection = collection.orderBy(options.orderBy);
  // Grab data irregardless
  const data = collection.get().then((querySnapshot: any) => {
    return mapSnapshotToArray(querySnapshot);
  });
  // If a callback was given, assume we want to watch for changes
  if (options && options.callback) {
    collection.onSnapshot((querySnapshot: any) => {
      const data = mapSnapshotToArray(querySnapshot);
      options.callback(data);
    });
  }
  return data;
};

const getUser = async () => {
  await import("firebase/auth");
  return new Promise((resolve: any) => {
    firebase.auth().onAuthStateChanged((user: any) => {
      resolve(user);
    });
  });
};

export class Firebase {
  public constructor(config: config) {
    this.init(config);
  }

  public init = initialize;
  public addDocument = addDocument;
  public getDocument = getDocument;
  public updateDocument = updateDocument;
  public deleteDocument = deleteDocument;
  public getCollection = getCollection;
  public getUser = getUser;
}
