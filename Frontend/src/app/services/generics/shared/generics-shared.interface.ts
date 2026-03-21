import { ResourceStatus, Signal } from "@angular/core";

export interface GenericsShared {
    isLoading: Signal<boolean>;
    
    error: Signal<Error | undefined>;

    status: Signal<ResourceStatus>;

    destroy(): void;

    reload(): void;
}