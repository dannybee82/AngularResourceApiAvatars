import { resource, ResourceRef, ResourceStatus, Signal, signal, WritableSignal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GenericsShared } from "../shared/generics-shared.interface";
import { GenericsUpdateInterface } from "./generics-update.interface";

const api: string = environment.endpoint;

export abstract class GenericsUpdateClass<T> implements GenericsUpdateInterface<T>, GenericsShared {

    constructor(
        protected controller: string,
        protected methodname: string
    ) {}

    entity: WritableSignal<T | undefined> = signal(undefined);

    updateResource: ResourceRef<boolean | undefined> = resource({
        loader: async () => {
            if(this.entity() && this.controller && this.methodname) {
                const response = await fetch(
                    `${api}${this.controller}/${this.methodname}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(this.entity()),
                        headers: {"Content-Type": "application/json"}
                    }
                );
                    
                return await response.ok ? true : false;
            } 
        
            return undefined;   
        }
    });

    data: WritableSignal<boolean | undefined> = this.updateResource.value;
    isLoading: Signal<boolean> = this.updateResource.isLoading;
    error: Signal<unknown> = this.updateResource.error;
    status: Signal<ResourceStatus> = this.updateResource.status;
    
    onChangeEntity(entity: T): void {
        this.entity.set(entity);
    }

    destroyResource(): void {
        this.updateResource.destroy();
    }  

}