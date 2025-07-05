import { ResourceRef, WritableSignal } from "@angular/core";

export interface GenericsCreateOrUpdateInterface<T> {
    method: WritableSignal<'POST' | 'PUT' | undefined>;

    entity: WritableSignal<T | undefined>;

    createOrUpdateResource: ResourceRef<boolean | undefined>;

    data: WritableSignal<boolean | undefined>;

    onChangeEntity(entity: T): void;
}