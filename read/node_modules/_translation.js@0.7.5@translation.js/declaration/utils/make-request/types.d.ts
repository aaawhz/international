import { StringObject } from '../../types';
export interface StringArrayObject {
    [key: string]: string | string[];
}
export interface RequestOptions {
    url: string;
    query?: StringArrayObject;
    method?: 'get' | 'post';
    body?: object;
    type?: 'form' | 'json';
    headers?: StringObject;
    responseType?: 'document' | 'json' | 'text';
}
