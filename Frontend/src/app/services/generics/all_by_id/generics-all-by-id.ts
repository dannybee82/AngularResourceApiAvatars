import { computed, inject, Injectable, resource, ResourceRef, ResourceStatus, signal, Signal, WritableSignal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GenericsAllByIdInterface } from "./generics-all-by-id.interface";
import { GenericsShared } from "../shared/generics-shared.interface";
import { RESOURCE_CONFIG } from "../tokens/resource.config";

@Injectable({
  providedIn: 'root'
})  
export class GenericsAllByIdService<T> implements GenericsAllByIdInterface<T>, GenericsShared {    

    private _defaultValue: T[] | undefined = undefined;
  
    private readonly config = inject(RESOURCE_CONFIG);  
    private readonly api = environment.endpoint;  

    readonly params: WritableSignal<Record<string, any> | undefined> = signal<Record<string, any> | undefined>(undefined);
    
    private readonly resource: ResourceRef<T[] | undefined> = resource<T[] | undefined, unknown>({  
        defaultValue: this._defaultValue ?? undefined,
        params: () => this.params(),
        loader: async ({ params, abortSignal }) => { 
            const res = await fetch(  
                `${this.api}${this.config.controller}/${this.config.methodGetAllById}${this.prepareParams(params!)}`,  
                { method: 'GET', signal: abortSignal, headers: { Accept: 'application/json' } }  
            );  
            if (!res.ok) throw new Error(`HTTP ${res.status}`);  
            return (await res.json()) as T[];
        }  
    });  
      
    readonly data: WritableSignal<T[] | undefined> = this.resource.value;  
    readonly isLoading: Signal<boolean> = this.resource.isLoading;  
    readonly error: Signal<Error | undefined>   = this.resource.error;  
    readonly hasValue: Signal<boolean> = computed(() => this.resource.hasValue());  
    readonly status: Signal<ResourceStatus> = this.resource.status;

    reload(): void 
    { 
        this.resource.reload(); 
    }  

    destroy(): void { 
        this.resource.destroy(); 
    }  

    private prepareParams(params: Record<string, any>): string {
        let p: string = '';
        if(this.params()) {
            for (const [key, value] of Object.entries(params)) {
                p = p === '' ? 
                    p += '?' + key + '=' + value : 
                    p += '&' + key + '=' + value;
            }
        }

        return p;
    }
}