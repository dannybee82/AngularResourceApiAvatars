import { Component, computed, effect, inject, input, InputSignal, OnInit, ResourceStatus, Signal, signal, WritableSignal } from '@angular/core';
import { AllMaterialsModule } from '../../all-materials.module';
import { OpenFile } from '../../components/open-file/open-file';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropper } from '../../components/image-cropper/image-cropper';
import { Observable } from 'rxjs';
import { AvatarPerson } from '../../models/avatar/avatar-person.interface';
import { Router } from '@angular/router';
import { Dialog } from '../../components/dialog/dialog';
import { DialogInterface } from '../../models/dialog/dialog.interface';
import { DialogType } from '../../models/dialog/dialog-type.enum';
import { GenericsByIdService } from '../../services/generics/by_id/generics-by-id';
import { GenericsCreateService } from '../../services/generics/create/generics-create';
import { GenericsDeleteService } from '../../services/generics/delete/generics-delete';
import { RESOURCE_CONFIG } from '../../services/generics/tokens/resource.config';
import { GenericsUpdateService } from '../../services/generics/update/generics-update';
import { form, min, max, required, FormField } from '@angular/forms/signals';
import { ToastService } from '../../services/toast/toast-service';

@Component({
  selector: 'app-avatars-create-or-update',
  imports: [
    AllMaterialsModule,
    OpenFile,
    Dialog,
    FormField
],
  templateUrl: './avatars-create-or-update.html',
  styleUrl: './avatars-create-or-update.scss',
  providers: [  
    GenericsByIdService<AvatarPerson>, GenericsCreateService<AvatarPerson>, GenericsUpdateService<AvatarPerson>, GenericsDeleteService,  
    {  
      provide: RESOURCE_CONFIG,  
      useValue: {  
        controller: 'Avatar',  
        methodById: 'GetById',
        methodCreate: 'Create',
        methodUpdate: 'Update',
        methodDelete: 'Delete'
      }  
    }  
  ]
})
export class AvatarsCreateOrUpdate implements OnInit {

  readonly mode: InputSignal<'create' | 'update'> = input.required();
  readonly id: InputSignal<number> = input.required();

  private readonly byIdService = inject(GenericsByIdService<AvatarPerson>);  
  private readonly createService = inject(GenericsCreateService<AvatarPerson>);  
  private readonly updateService = inject(GenericsUpdateService<AvatarPerson>);
  private readonly deleteService = inject(GenericsDeleteService);
  protected readonly dialog = inject(MatDialog);
  private readonly toastr = inject(ToastService);
  private readonly router = inject(Router);

  readonly isUpdateMode: Signal<boolean> = computed(() => this.mode() === 'update');
  private _avatarToUpdate: Signal<AvatarPerson | undefined> = computed(() => {
    if(!this.byIdService.error() && !this.byIdService.isLoading() && this.byIdService.status() === 'resolved') {
      return this.byIdService.data();
    }

    return undefined;
  });
  
  protected previewImageData: WritableSignal<string> = signal('');
  protected showDialog: WritableSignal<boolean> = signal(false);
  
  dialogData: DialogInterface = {
    dialogType: DialogType.WARNING,
    dialogTitle: 'Delete Avatar',
    dialogMessage: '',
    dialogCancellationText: 'Cancel',
    dialogConfirmationText: 'Delete',
    dialogConfirmationIcon: 'delete'
  };

  protected formModel: WritableSignal<AvatarPerson> = signal({
    name: '',
    age: 18,
    avatarCharacteristic: {
      hairColor: 'blond',
      eyeColor: 'blue',
      hasEarrings: false
    },
    avatarImage: {
      base64: ''
    }
  });
  protected avatarForm = form(this.formModel, (f) => {
    required(f.name),
    required(f.age),
    min(f.age, 18),
    max(f.age, 35)
    required(f.avatarCharacteristic!.hairColor),
    required(f.avatarCharacteristic!.eyeColor)
  });

  constructor() {
    effect(() => {
      if(this._avatarToUpdate()) {
        this.formModel.set(this._avatarToUpdate()!);
        this.avatarForm().value.set(this._avatarToUpdate()!);
        this.previewImageData.set(this._avatarToUpdate()!.avatarImage?.base64 ?? '');        
      }
    });

    effect(() => {
      const resolved: ResourceStatus = 'resolved';
      const error: ResourceStatus = 'error';
      const updateFinished = this.updateService.status();
      const createFinished = this.createService.status();
      const deleteFinished = this.deleteService.status();

      const successMessage: number = updateFinished === resolved ? 0 : createFinished === resolved ? 1 :  deleteFinished === resolved ? 2 : -1;
      const errorMessage: number = updateFinished === error ? 0 : createFinished === error ? 1 :  deleteFinished === error ? 2 : -1;

      switch(successMessage) {
        case 0:
          this.toastr.show('Avatar successfully updated', 'success');
          break;
        case 1:
          this.toastr.show('Avatar successfully created', 'success');
          break;
        case 2:
          this.toastr.show('Avatar successfully deleted', 'success');
          break;
      }

      switch(errorMessage) {
        case 0:
          this.toastr.show('Can\'t update Avatar', 'error');
          break;
        case 1:
          this.toastr.show('Can\'t create Avatar', 'error');
          break;
        case 2:
          this.toastr.show('Can\'t delete Avatar', 'error');
          break;
      }

      if(updateFinished === resolved || createFinished === resolved || deleteFinished === resolved) {
        this.router.navigate(['/']);
      }
    });

    effect(() => {
      if(this.isUpdateMode() && this.byIdService.error()) {
        this.toastr.show('Can\'t fetch Avatar to update', 'error');
      }
    });
  }

  ngOnInit(): void {
    if(this.id() && parseInt(this.id().toString()) !== -1 && !isNaN(parseInt(this.id().toString()))) {
      const id: number = parseInt(this.id().toString());
      const params: Record<string, any> = {
        id: id
      };
      this.byIdService.params.set(params); 
    }
  }

  getFile(file: File): void {
    if(file) {
      const _file = URL.createObjectURL(file);

      this.openAvatarEditor(_file).subscribe((result: string) => {
        if (result) {
          this.loadImagePreview(result);
        }
      });
    }
  }

  openAvatarEditor(image: string): Observable<string> {
    const dialogRef = this.dialog.open(ImageCropper, {
      minWidth: '500px',
      minHeight: '700px',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }

  removeImage(): void {
    this.previewImageData.set('');
  }  

  submit($event: SubmitEvent): void {    
    $event.preventDefault();

    if(this.avatarForm().valid() && this.previewImageData() !== '') {
      const avatarPerson: AvatarPerson = Object.assign(this.avatarForm().value());
      avatarPerson.avatarImage!.base64 = this.previewImageData();

      if(this.isUpdateMode()) {
        avatarPerson.id = this._avatarToUpdate()!.id;
        avatarPerson.avatarCharacteristic!.id = this._avatarToUpdate()!.avatarCharacteristic?.id ?? 0;
        avatarPerson.avatarImage!.id = this._avatarToUpdate()!.avatarImage?.id ?? 0;
        this.updateService.entity.set(avatarPerson);
      } else {
        this.createService.entity.set(avatarPerson);
      }
    } else {
      this.avatarForm().markAsTouched();
      this.toastr.show('Forms invalid or no image', 'error');
    }
  }

  deleteAvatar(): void {
    if(this.isUpdateMode()) {
      this.dialogData.dialogMessage = 'Do you want to delete the Avatar below?';
      this.dialogData.dialogAdditionalText = `Avatar: ${this.formModel().name} - Age: ${this.formModel().age}`;  
      this.showDialog.set(true);
    }   
  }

  execDelete($event: boolean): void {
    this.dialogData.dialogMessage = '';
    this.dialogData.dialogAdditionalText = '';  
    this.showDialog.set(false);

    if($event) {
      this.deleteService.id.set(this.id());
    }    
  }

  private loadImagePreview(base64string: string): void {
    this.previewImageData.set(base64string);
  }

}