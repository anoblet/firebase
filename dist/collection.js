import { addDocument, getCollection } from "./index";
export class Collection {
    constructor(uri) {
        this.subscribers = [];
        this.subscribers = [];
        this.uri = uri;
        this.getData();
    }
    async getData() {
        getCollection(this.uri, {
            callback: (data) => {
                this.data = data;
                this.onUpdate(data);
                return {};
            },
        });
    }
    add(data) {
        addDocument(this.uri, data);
        return this;
    }
    onUpdate(data) {
        var _a;
        (_a = this.subscribers) === null || _a === void 0 ? void 0 : _a.map((callback) => callback(data));
        return {};
    }
    subscribe(callback) {
        callback(this.data);
        this.subscribers.push(callback);
    }
}
