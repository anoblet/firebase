export declare class Collection {
    data: any[];
    orderBy: string;
    subscribers: any[];
    uri: string;
    constructor({ orderBy, uri }: {
        orderBy?: string;
        uri: string;
    });
    getData(): Promise<void>;
    add(data: any): this;
    onUpdate(data: any): {};
    subscribe(callback: any): void;
}
