import { computed, inject, Injectable, resource, ResourceRef, ResourceStatus, Signal, signal, WritableSignal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { RESOURCE_CONFIG } from "../tokens/resource.config";
import { GenericsShared } from "../shared/generics-shared.interface";
import { GenericsByIdInterface } from "./generics-by-id.interface";

@Injectable({
  providedIn: 'root'
})
export class GenericsByIdService<T> implements GenericsByIdInterface<T>, GenericsShared {

  private readonly config = inject(RESOURCE_CONFIG);  
  private readonly api = environment.endpoint;  
  
  readonly params: WritableSignal<Record<string, any> | undefined> = signal<Record<string, any> | undefined>(undefined);  
  
  private readonly resource: ResourceRef<T | undefined> = resource({  
    params: () => this.params(),
    loader: async ({ params, abortSignal }) => {  
      const res = await fetch(  
        `${this.api}${this.config.controller}/${this.config.methodById}${this.prepareParams(params)}`,  
        { method: 'GET', signal: abortSignal, headers: { Accept: 'application/json' } }  
      );  
      if (!res.ok) throw new Error(`HTTP ${res.status}`);  
      return (await res.json()) as T;  
    }  
  }); 
  
  readonly data: WritableSignal<T | undefined> = this.resource.value;  
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

  private prepareParams(params: Record<string, any>): string {
    let p: string = '';

    for (const [key, value] of Object.entries(params)) {
      p = p === '' ? 
        p += '?' + key + '=' + value : 
        p += '&' + key + '=' + value;
    }

    return p;
  }
  
}