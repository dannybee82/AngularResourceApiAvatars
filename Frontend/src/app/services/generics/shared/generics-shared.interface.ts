import { ResourceStatus, Signal } from "@angular/core";

export interface GenericsShared {
    isLoading: Signal<boolean>;
    
    error: Signal<unknown>;

    status: Signal<ResourceStatus>;

    destroyResource(): void;
}