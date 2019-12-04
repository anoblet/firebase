// import firebase from "firebase/app";
import { config } from "./types";
import { mapSnapshotToArray } from "./utility";

export type Firebase_ = typeof import("firebase");

declare global {
  interface Window {
    firebase: Firebase_;
  }
}

const loadScript = (url: string): any =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onerror = reject;
    document.head.appendChild(script);
    script.onload = () => {
      resolve(window.firebase);
    };
  });

const loadedModules = [];

export const loadModule = (module: string) => {
  if (loadedModules.includes(module)) return;
  const result = loadScript(
    `https://www.gstatic.com/firebasejs/7.5.0/firebase-${module}.js`
  );
  if (result) loadedModules.push(module);
  return result;
};

/**
 * Initialize the firebase app
 * @param  config Configuration object
 * @return void
 */
export const initialize = async config => {
  if (window.firebase.apps && window.firebase.apps.length === 0)
    window.firebase.initializeApp(config);
  enablePersistance();
};

export const enablePersistance = async () => {
  window.firebase
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
  await loadModule("firestore");
  return window.firebase
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
  await loadModule("firestore");
  const document = window.firebase.firestore().doc(path);
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
  await loadModule("firestore");
  return window.firebase
    .firestore()
    .doc(path)
    .set(data, { merge: true })
    .then((docRef: any) => true)
    .catch(error => false);
};

export const deleteDocument = async (path: string) => {
  return window.firebase
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
  await loadModule("app");
  await loadModule("firestore");
  let collection: any = window.firebase.firestore().collection(path);
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
  return new Promise((resolve: any) => {
    window.firebase.auth().onAuthStateChanged((user: any) => {
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
