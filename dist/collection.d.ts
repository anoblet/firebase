export declare class Collection {
    data: any[];
    subscribers: any[];
    uri: string;
    constructor(uri: string);
    getData(): Promise<void>;
    add(data: any): this;
    onUpdate(data: any): {};
    subscribe(callback: any): void;
}
