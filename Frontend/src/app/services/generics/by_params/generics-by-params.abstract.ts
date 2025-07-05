import { resource, ResourceRef, ResourceStatus, Signal, signal, WritableSignal } from "@angular/core";
import { GenericsByParamsInterface } from "./generics-by-params.interface";
import { environment } from "../../../../environments/environment";
import { GenericsShared } from "../shared/generics-shared.interface";

const api: string = environment.endpoint;

export abstract class  GenericsByParamsClass<T> implements GenericsByParamsInterface<T>, GenericsShared {

  constructor(
    protected controller: string,
    protected methodnameGetAll: string,
    protected methodnameByParams: string
  ) {}

  targetParams: WritableSignal<any | undefined> = signal(undefined);

  getByParamsResource: ResourceRef<T[] | undefined> = resource({
    loader: async (params) => {
      if(!this.targetParams()) {
        const response = await fetch(
          `${api}${this.controller}/${this.methodnameGetAll}?id=${params.params}`, 
          {
            signal: params.abortSignal, 
            headers: {"Content-Type": "application/json"}
          }
        );  
        
        return await response.json() as T[];
      }

      if(this.targetParams()) {
        const params = new URLSearchParams();
        Object.entries(this.targetParams()).forEach(([key, value]) => {  
          params.append(key, String(value));
        });

        const response = await fetch(
          `${api}${this.controller}/${this.methodnameByParams}?${params.toString()}`, 
          {
            headers: {"Content-Type": "application/json"}
          }
        );  
        
        return await response.json() as T[];
      }
          
      return undefined;
    }    
  });

  data: Signal<T[] | undefined> = this.getByParamsResource.value;
  isLoading: Signal<boolean> = this.getByParamsResource.isLoading;
  error: Signal<unknown> = this.getByParamsResource.error;
  status: Signal<ResourceStatus> = this.getByParamsResource.status;
  hasValue: boolean = this.getByParamsResource.hasValue();

  reload(): void {
    this.getByParamsResource.reload();
  }

  destroyResource(): void {
    this.getByParamsResource.destroy();
  }

}