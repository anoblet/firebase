import { addDocument, getCollection } from "./index";
export class Collection {
    constructor(uri) {
        this.uri = uri;
    }
    async getData() {
        this.data = await getCollection(this.uri);
    }
    add(data) {
        addDocument(this.uri, data);
    }
}
