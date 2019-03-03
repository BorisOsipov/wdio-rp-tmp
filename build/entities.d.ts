import { STATUS, TYPE } from "./constants";
export declare class StartTestItem {
    name: string;
    description: any;
    parameters?: any[];
    tags?: any[];
    type: TYPE;
    constructor(name: string, type: TYPE);
    addTagsToTest(): void;
}
export declare class EndTestItem {
    status: STATUS;
    issue?: Issue;
    description?: string;
    constructor(status: STATUS, issue?: Issue);
}
export declare class Issue {
    issue_type: string;
    constructor(issue_type: string);
}
export declare class StorageEntity {
    readonly type: TYPE;
    readonly id: string;
    readonly promise: Promise<any>;
    readonly wdioEntity: any;
    constructor(type: TYPE, id: string, promise: Promise<any>, wdioEntity: any);
}
