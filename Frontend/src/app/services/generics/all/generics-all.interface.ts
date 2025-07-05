import { ResourceRef, Signal } from "@angular/core";

export interface GenericsAllInterface<T> {
    getAllResource: ResourceRef<T[] | undefined>;
   
    data: Signal<T[] | undefined>    

    reload(): void;

    hasValue: boolean;
}