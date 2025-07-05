import { ResourceRef, WritableSignal } from "@angular/core";

export interface GenericsUpdateInterface<T> {
    entity: WritableSignal<T | undefined>;

    updateResource: ResourceRef<boolean | undefined>;

    data: WritableSignal<boolean | undefined>;

    onChangeEntity(entity: T): void;    
}