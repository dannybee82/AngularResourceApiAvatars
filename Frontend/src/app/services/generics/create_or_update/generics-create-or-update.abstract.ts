import { resource, ResourceRef, ResourceStatus, Signal, signal, WritableSignal } from "@angular/core";
import { GenericsShared } from "../shared/generics-shared.interface";
import { GenericsCreateOrUpdateInterface } from "./generics-create-or-update.interface";
import { environment } from "../../../../environments/environment";

const api: string = environment.endpoint;

export abstract class GenericsCreateOrUpdateClass<T> implements GenericsCreateOrUpdateInterface<T>, GenericsShared {

    method: WritableSignal<"POST" | "PUT" | undefined> = signal(undefined);

    constructor(
        protected controller: string,
        protected methodnamePost: string,
        protected methodnameUpdate: string
    ) {}

    entity: WritableSignal<T | undefined> = signal(undefined);

    createOrUpdateResource: ResourceRef<boolean | undefined> = resource({
        params: this.entity,
        loader: async () => {
            if(this.entity() && this.controller && this.method()) {
                const targetMethodName = this.method() === "POST" ? this.methodnamePost : this.methodnameUpdate;
                const response = await fetch(
                    `${api}${this.controller}/${targetMethodName}`,
                    {
                        method: this.method(),
                        body: JSON.stringify(this.entity()),
                        headers: {"Content-Type": "application/json"}
                    }
                );
                    
                return await response.ok ? true : false;
            } 
        
            return undefined;   
        }
    });

    data: WritableSignal<boolean | undefined> = this.createOrUpdateResource.value;
    isLoading: Signal<boolean> = this.createOrUpdateResource.isLoading;
    error: Signal<unknown> = this.createOrUpdateResource.error;
    status: Signal<ResourceStatus> = this.createOrUpdateResource.status;

    onChangeEntity(entity: T): void {
        this.entity.set(entity);
    }

    destroyResource(): void {
        this.createOrUpdateResource.destroy();
    }

}