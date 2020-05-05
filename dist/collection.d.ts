export declare class Collection {
    private uri;
    data: any[];
    subscribers: any[];
    constructor(uri: string);
    getData(): Promise<void>;
    add(data: any): this;
    onUpdate(data: any): {};
    subscribe(callback: any): void;
}
