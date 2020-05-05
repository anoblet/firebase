import { addDocument, getCollection } from "./index";

export class Collection {
  data: any[];
  subscribers: any[] = [];
  uri: string;

  constructor(uri: string) {
    this.subscribers = [];
    this.uri = uri;
    this.getData();
  }

  async getData() {
    getCollection(this.uri, {
      callback: (data: any) => {
        this.data = data;
        this.onUpdate(data);
        return {};
      },
    });
  }

  add(data: any) {
    addDocument(this.uri, data);
    return this;
  }

  onUpdate(data: any) {
    this.subscribers?.map((callback) => callback(data));
    return {};
  }

  subscribe(callback) {
    callback(this.data);
    this.subscribers.push(callback);
  }
}
