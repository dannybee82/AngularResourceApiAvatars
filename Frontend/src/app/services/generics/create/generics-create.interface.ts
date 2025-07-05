import { ResourceRef, WritableSignal } from "@angular/core";

export interface GenericsCreateInterface<T> {
    entity: WritableSignal<T | undefined>;

    createResource: ResourceRef<boolean | undefined>;

    data: WritableSignal<boolean | undefined>;

    onChangeEntity(entity: T): void;
}