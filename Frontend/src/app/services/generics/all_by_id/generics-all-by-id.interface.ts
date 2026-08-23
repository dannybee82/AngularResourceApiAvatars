import { ResourceRef, Signal, WritableSignal } from "@angular/core";

export interface GenericsAllByIdInterface<T> {   
    data: Signal<T[] | undefined>    

    hasValue: Signal<boolean>;

    params: WritableSignal<Record<string, any> | undefined>;
}