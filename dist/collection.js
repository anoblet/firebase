import { addDocument, getCollection } from "./index";
export class Collection {
    constructor({ orderBy, uri }) {
        this.subscribers = [];
        this.orderBy = orderBy;
        this.uri = uri;
        this.getData();
    }
    async getData() {
        getCollection(this.uri, {
            callback: (data) => {
                console.log("hi", data);
                this.data = data;
                this.onUpdate(data);
                return {};
            },
            orderBy: this.orderBy,
        });
    }
    add(data) {
        console.log(this.uri, data);
        console.log(addDocument(this.uri, data));
        return this;
    }
    onUpdate(data) {
        var _a;
        (_a = this.subscribers) === null || _a === void 0 ? void 0 : _a.map((callback) => callback(data));
        return {};
    }
    subscribe(callback) {
        if (this.data)
            callback(this.data);
        this.subscribers.push(callback);
    }
}
