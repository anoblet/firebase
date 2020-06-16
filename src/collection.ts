import { addDocument, getCollection } from "./index";

export class Collection {
  data: any[];
  orderBy: string;
  subscribers: any[] = [];
  uri: string;

  constructor({ orderBy, uri }: { orderBy?: string; uri: string }) {
    this.orderBy = orderBy;
    this.uri = uri;
    this.getData();
  }

  async getData() {
    getCollection(this.uri, {
      callback: (data: any) => {
        console.log("hi", data);
        this.data = data;
        this.onUpdate(data);
        return {};
      },
      orderBy: this.orderBy,
    });
  }

  add(data: any) {
    console.log(this.uri, data);
    console.log(addDocument(this.uri, data));
    return this;
  }

  onUpdate(data: any) {
    this.subscribers?.map((callback) => callback(data));
    return {};
  }

  subscribe(callback) {
    if (this.data) callback(this.data);
    this.subscribers.push(callback);
  }
}
