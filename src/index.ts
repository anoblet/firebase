import firebase from "firebase/app";
import { config } from "./types";
import { mapSnapshotToArray } from "./utility";

export class Firebase {
  public config: config;
  public instance;

  public constructor(config: config) {
    this.init(config);
    this.config = config;
  }

  protected init(config: config) {
    // Check if instance has already been created
    if (firebase.apps.length === 0)
      this.instance = firebase.initializeApp(config);
  }

  public async addDocument(path: string, data: {}) {
    await import("firebase/firestore");
    return this.instance
      .firestore()
      .collection(path)
      .add(data)
      .then((docRef: any) => {
        return docRef.id;
      });
  }

  async getDocument(path: string, options?: { callback?: (data: {}) => {} }) {
    await import("firebase/firestore");
    const document = this.instance.firestore().doc(path);
    const data = document.get().then((doc: any) => doc.data());
    // If a callback was given, assume we want to watch for changes
    if (options && options.callback)
      document.onSnapshot((doc: any) => {
        const data = doc.data();
        options.callback(data);
      });
    return data;
  }

  public async updateDocument(path: string, data: {}) {
    return this.instance
      .firestore()
      .doc(path)
      .set(data, { merge: true });
  }

  public async deleteDocument(path: string) {
    return this.instance
      .firestore()
      .doc(path)
      .delete();
  }

  async getCollection(
    path: string,
    options?: {
      callback?: (data: {}) => {};
      orderBy?: string;
      where?: {
        property: string;
        operator: string;
        value: boolean | string;
      };
    }
  ) {
    // Import dependencies
    await import("firebase/firestore");
    let collection = this.instance.firestore().collection(path);
    if (options && options.where) {
      collection = collection.where(
        options.where.property,
        options.where.operator,
        options.where.value
      );
    }
    if (options && options.orderBy) collection = collection.orderBy(options.orderBy);
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
  }

  public async getUser() {
    await import("firebase/auth");
    return new Promise((resolve: any) => {
      this.instance.auth().onAuthStateChanged((user: any) => {
        resolve(user);
      });
    });
  }
}
