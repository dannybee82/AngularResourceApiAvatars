import { resource, ResourceRef, ResourceStatus, Signal, signal, WritableSignal } from "@angular/core";
import { GenericsByIdInterface } from "./generics-by-id.interface";
import { environment } from "../../../../environments/environment";
import { GenericsShared } from "../shared/generics-shared.interface";

const api: string = environment.endpoint;

export abstract class GenericsByIdClass<T> implements GenericsByIdInterface<T>, GenericsShared {

  private _defaultValue: T | undefined = undefined;

  constructor(
    protected controller: string,
    protected methodname: string,
    protected defaultValue: T | undefined
  ) {
    this._defaultValue = defaultValue;
  }

  targetId: WritableSignal<number> = signal(0);

  getByIdResource: ResourceRef<T | undefined> = resource({
    defaultValue: this._defaultValue,
    params: this.targetId,
    loader: async (params) => {    
      if(this.controller && this.methodname && params.params > 0) {
        const response = await fetch(
          `${api}${this.controller}/${this.methodname}?id=${params.params}`, 
          {
            signal: params.abortSignal, 
            headers: {"Content-Type": "application/json"}
          }
        );
        
        return await response.json() as T;
      }
          
      return undefined;
    }
  });

  data: Signal<T | undefined> = this.getByIdResource.value;
  isLoading: Signal<boolean> = this.getByIdResource.isLoading;
  error: Signal<unknown> = this.getByIdResource.error;
  status: Signal<ResourceStatus> = this.getByIdResource.status;
  hasValue: boolean = this.getByIdResource.hasValue();

  reload(): void {
    this.getByIdResource.reload();
  }

  onTargetIdChange(id: number): void {
    this.targetId.set(id);
  }

  destroyResource(): void {
    this.getByIdResource.destroy();
  }

}