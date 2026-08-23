import {  computed, inject, Injectable, resource, ResourceRef, ResourceStatus,  Signal, signal, WritableSignal } from '@angular/core';  
import { environment } from '../../../../environments/environment';  
import { RESOURCE_CONFIG, ResourceConfig } from '../tokens/resource.config';
import { GenericsByParamsInterface } from './generics-by-params.interface';
import { GenericsShared } from '../shared/generics-shared.interface';
  
@Injectable({
  providedIn: 'root'
})  
export class GenericsByParamsService<T, U> implements GenericsByParamsInterface<T>, GenericsShared {
 
  private readonly config: ResourceConfig = inject(RESOURCE_CONFIG);  
  private readonly api: string = environment.endpoint;  
  
  readonly params: WritableSignal<U | undefined> = signal(undefined);  
  readonly additionalParams: WritableSignal<Record<string, any> | undefined> = signal<Record<string, any> | undefined>(undefined);
  
  private readonly resource: ResourceRef<T[] | undefined> = resource<T[] | undefined, unknown>({  
    params: () => this.params(),
    loader: async ({ abortSignal }) => { 
      if(this.params()) {
        const url = this.params()
        ? this.buildParamsUrl(this.params()!, this.additionalParams())  
        : `${this.api}${this.config.controller}/${this.config.methodGetAll}`;  
  
        const response = await fetch(url, {  
          signal: abortSignal,  
          headers: { 'Content-Type': 'application/json' }  
        });  
        
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);  
        return response.json() as Promise<T[]>;  
      }
      
      return undefined;
    }  
  });  

  readonly data: Signal<T[] | undefined> = this.resource.value;  
  readonly isLoading: Signal<boolean> = this.resource.isLoading;  
  readonly error: Signal<Error | undefined> = this.resource.error;  
  readonly status: Signal<ResourceStatus> = this.resource.status;  
  readonly hasValue: Signal<boolean> = computed(() => this.resource.hasValue()); 
  
  reload(): void 
  { 
    this.resource.reload(); 
  }  

  destroy(): void { 
    this.resource.destroy(); 
  }  
  
  private buildParamsUrl(params: Record<string, unknown>, additionalParams: Record<string, any> | undefined): string {  
    const query = new URLSearchParams(  
      Object.entries(params).map(([k, v]) => [k, String(v)])  
    ); 
    
    if(additionalParams) {
      let p: string = '';
      
      for (const [key, value] of Object.entries(this.params()!)) {
        p += '&' + key + '=' + value;
      }

      return `${this.api}${this.config.controller}/${this.config.methodByParams}?${query}${p}`;
    }
    
    return `${this.api}${this.config.controller}/${this.config.methodByParams}?${query}`;
  }  
}