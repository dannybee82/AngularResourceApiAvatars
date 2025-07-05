import { ResourceRef, Signal, WritableSignal } from "@angular/core";

export interface GenericsByIdInterface<T> {
    targetId: WritableSignal<number>;

    getByIdResource: ResourceRef<T | undefined>;
   
    data: Signal<T | undefined>    

    onTargetIdChange(id: number): void;

    reload(): void;
    
    hasValue: boolean;
}