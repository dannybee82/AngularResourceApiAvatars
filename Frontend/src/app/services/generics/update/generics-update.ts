import { computed, inject, Injectable, resource, ResourceRef, ResourceStatus, Signal, signal, WritableSignal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GenericsShared } from "../shared/generics-shared.interface";
import { GenericsUpdateInterface } from "./generics-update.interface";
import { RESOURCE_CONFIG } from "../tokens/resource.config";

@Injectable({
  providedIn: 'root'
})  
export class GenericsUpdateService<T> implements GenericsUpdateInterface<T>, GenericsShared {
    private readonly config = inject(RESOURCE_CONFIG);  
    private readonly api: string = environment.endpoint;  
    
    entity: WritableSignal<T | undefined> = signal(undefined);

    private readonly resource: ResourceRef<boolean | undefined> = resource<boolean | undefined, unknown>({
        params: this.entity,
        loader: async () => {
            if(this.entity() && this.config.controller && this.config.methodUpdate) {
                const response = await fetch(
                    `${this.api}${this.config.controller}/${this.config.methodUpdate}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(this.entity()),
                        headers: {"Content-Type": "application/json"}
                    }
                );
                    
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.ok ? true : false;
            } 
        
            return undefined;   
        }
    });

    readonly data: WritableSignal<boolean | undefined> = this.resource.value;  
    readonly isLoading: Signal<boolean> = this.resource.isLoading;  
    readonly error: Signal<Error | undefined> = this.resource.error;  
    readonly hasValue: Signal<boolean> = computed(() => this.resource.hasValue());
    readonly status: Signal<ResourceStatus> = this.resource.status;

    reload(): void 
    { 
      this.resource.reload(); 
    }  

    destroy(): void { 
      this.resource.destroy(); 
    }
}