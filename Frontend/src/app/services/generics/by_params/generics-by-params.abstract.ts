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
  
  private readonly resource: ResourceRef<T[] | undefined> = resource<T[], U | undefined>({  
    params: () => this.params(),
    loader: async ({ params, abortSignal }) => { 
      const url = params
        ? this.buildParamsUrl(params)  
        : `${this.api}${this.config.controller}/${this.config.methodGetAll}`;  
  
      const response = await fetch(url, {  
        signal: abortSignal,  
        headers: { 'Content-Type': 'application/json' }  
      });  
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);  
      return response.json() as Promise<T[]>;  
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
  
  private buildParamsUrl(params: Record<string, unknown>): string {  
    const query = new URLSearchParams(  
      Object.entries(params).map(([k, v]) => [k, String(v)])  
    );  
    return `${this.api}${this.config.controller}/${this.config.methodByParams}?${query}`;  
  }  
}