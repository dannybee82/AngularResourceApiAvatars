import { resource, ResourceRef, ResourceStatus, Signal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GenericsAllInterface } from "./generics-all.interface";
import { GenericsShared } from "../shared/generics-shared.interface";

const api: string = environment.endpoint;

export abstract class GenericsAllClass<T> implements GenericsAllInterface<T>, GenericsShared {

    private _defaultValue: T[] | undefined = undefined;

    constructor(
        protected controller: string,
        protected methodname: string,
        protected defaultValue: T[] | undefined
    ) {
        this._defaultValue = defaultValue;
    }

    getAllResource: ResourceRef<T[] | undefined> = resource({  
        defaultValue: this._defaultValue ?? undefined,
        loader: async () => {
            if(this.controller && this.methodname && this.defaultValue) {
                const response = await fetch(
                    `${api}${this.controller}/${this.methodname}`, 
                    {
                        headers: {"Content-Type": "application/json"}
                    }
                );
                return await response.json() as T[];
            }

            return undefined;            
        }
    });
    
    data: Signal<T[] | undefined> = this.getAllResource.value;
    isLoading: Signal<boolean> = this.getAllResource.isLoading;
    error: Signal<unknown> = this.getAllResource.error;
    status: Signal<ResourceStatus> = this.getAllResource.status;
    hasValue: boolean = this.getAllResource.hasValue();

    reload(): void {
        this.getAllResource.reload();
    }

    destroyResource(): void {
        this.getAllResource.destroy();
    }

}