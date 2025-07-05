import { ResourceRef, Signal, WritableSignal } from "@angular/core";

export interface GenericsByParamsInterface<T> {
    targetParams: WritableSignal<any | undefined>;

    getByParamsResource: ResourceRef<T[] | undefined>;
   
    data: Signal<T[] | undefined>    

    reload(): void;
    
    hasValue: boolean;
}