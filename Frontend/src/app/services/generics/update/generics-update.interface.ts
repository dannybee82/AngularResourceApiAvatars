import { ResourceRef, WritableSignal } from "@angular/core";

export interface GenericsUpdateInterface<T> {
    entity: WritableSignal<T | undefined>;

    data: WritableSignal<boolean | undefined>;
}