import { addDocument, getCollection } from "./index";

export class Collection {
  data: any[];

  constructor(private uri: string) {}

  async getData() {
    this.data = await getCollection(this.uri);
  }

  add(data: any) {
    addDocument(this.uri, data);
  }
}
