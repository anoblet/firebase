import { addDocument, getCollection } from "./index";
export class Collection {
    constructor(uri) {
        this.uri = uri;
        this.subscribers = [];
    }
    async getData() {
        this.data = await getCollection(this.uri, { callback: this.onUpdate });
    }
    add(data) {
        addDocument(this.uri, data);
        return this;
    }
    onUpdate(data) {
        this.subscribers.map((callback) => callback(data));
        return {};
    }
    subscribe(callback) {
        this.subscribers.push(callback);
    }
}
