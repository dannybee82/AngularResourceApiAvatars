import { ResourceRef, WritableSignal } from "@angular/core";

export interface GenericsCreateInterface<T> {
    entity: WritableSignal<T | undefined>;

    data: WritableSignal<boolean | undefined>;
}