import { ResourceRef, Signal, WritableSignal } from "@angular/core";

export interface GenericsByParamsInterface<T> {
    params: WritableSignal<any | undefined>;

    additionalParams: WritableSignal<Record<string, any> | undefined>;
   
    data: Signal<T[] | undefined>;

    reload(): void;
    
    hasValue: Signal<boolean>;
}