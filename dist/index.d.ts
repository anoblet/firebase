/**
 * Initialize the firebase app
 * @param  config Configuration object
 * @return void
 */
export declare const initialize: (config: any) => Promise<void>;
export declare const enablePersistance: () => Promise<void>;
export declare const addDocument: (path: string, data: {}) => Promise<any>;
export declare const getDocument: (path: string, options?: {
    callback?: any;
}) => Promise<any>;
export declare const updateDocument: (path: string, data: {}) => Promise<boolean>;
export declare const deleteDocument: (path: string) => Promise<void>;
export declare const getCollection: (path: string, options?: {
    callback?: (data: {}) => {};
    orderBy?: string;
    where?: {
        property: string;
        operator: any;
        value: string | boolean;
    };
}) => Promise<any>;
