export declare class Collection {
    private uri;
    data: any[];
    constructor(uri: string);
    getData(): Promise<void>;
    add(data: any): void;
}
