import { addDocument, getCollection } from "./index";

export class Collection {
  data: any[];
  subscribers: any[] = [];

  constructor(private uri: string) {}

  async getData() {
    this.data = await getCollection(this.uri, { callback: this.onUpdate });
  }

  add(data: any) {
    addDocument(this.uri, data);
    return this;
  }

  onUpdate(data: any) {
    this.subscribers.map((callback) => callback(data));
    return {};
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }
}
