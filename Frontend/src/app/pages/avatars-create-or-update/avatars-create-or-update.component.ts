import { Component, effect, EffectRef, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { AllMaterialsModule } from '../../all-materials.module';
import { FormGroup, UntypedFormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OpenFileComponent } from '../../components/open-file/open-file.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropperComponent } from '../../components/image-cropper/image-cropper.component';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AvatarPerson } from '../../models/avatar/avatar-person.interface';
import { AvatarCharacteristic } from '../../models/avatar/avatar-characteristic.interface';
import { AvatarImage } from '../../models/avatar/avatar-image.interface';
import { GenericsCreateOrUpdateClass } from '../../services/generics/create_or_update/generics-create-or-update.abstract';
import { Router } from '@angular/router';
import { AvatarByIdService } from '../../services/avatars/avatar-by-id.service';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { Dialog } from '../../models/dialog/dialog.interface';
import { DialogType } from '../../models/dialog/dialog-type.enum';
import { AvatarDeleteService } from '../../services/avatars/avatar-delete.service';

@Component({
  selector: 'app-avatars-create-or-update',
  imports: [
    AllMaterialsModule,
    FormsModule,
    ReactiveFormsModule,
    OpenFileComponent,
    DialogComponent
  ],
  templateUrl: './avatars-create-or-update.component.html',
  styleUrl: './avatars-create-or-update.component.scss'
})
export class AvatarsCreateOrUpdateComponent extends GenericsCreateOrUpdateClass<AvatarPerson> implements OnInit {

  readonly mode: InputSignal<string> = input.required();
  readonly id: InputSignal<number> = input.required();

  protected isUpdateMode: WritableSignal<boolean> = signal(false);
  protected previewImageData: WritableSignal<string> = signal('');
  protected showDialog: WritableSignal<boolean> = signal(false);
  
  dialogData: Dialog = {
    dialogType: DialogType.WARNING,
    dialogTitle: 'Delete Avatar',
    dialogMessage: '',
    dialogCancellationText: 'Cancel',
    dialogConfirmationText: 'Delete',
    dialogConfirmationIcon: 'delete'
  };

  private _updateData: WritableSignal<AvatarPerson | undefined> = signal(undefined);

  isApiFinished: EffectRef = effect(() => {
    if(this.status() === 'resolved' && this.data()) {
      this.toastr.success(this.isUpdateMode() ? 'Avatar updated successfully' : 'Avatar created successfully');
      this.destroyResource();
      this.router.navigate(['/all-avatars']);
    }
    
    if(this.status() === 'error') {
      this.toastr.error(this.isUpdateMode() ? 'Can\'t update Avatar' : 'Can\'t create Avatar');
    }
  });

  isDataFetched: EffectRef = effect(() => {
    if(this.service().data() && this.service().status() === 'resolved') {
      this._updateData.set(this.service().data());

      if(this._updateData()) {
        this.avatarPersonForm.patchValue(this._updateData()!);
        this.avatarCharacteristicForm.patchValue(this._updateData()?.avatarCharacteristic ?? {});
        this.previewImageData.set(this._updateData()?.avatarImage?.base64 ?? '');
      }      

      this.service().targetId.set(0);
    }

    if(this.service().status() === 'error') {
      this.toastr.error('Can\'t fetch Avatar to update');
    }
  });

  isAvatarDeleted: EffectRef = effect(() => {
    if(this.avatarDeleteService.data() && this.avatarDeleteService.status() === 'resolved') {
      this.avatarDeleteService.targetId.set(0);
      this.toastr.success('Avatar deleted successfully');
      this.router.navigate(['/all-avatars']);
    }

    if(this.avatarDeleteService.status() === 'error') {
      this.toastr.error('Can\'t delete Avatar');
    }
  });

  avatarPersonForm: UntypedFormGroup = new FormGroup({});
  avatarCharacteristicForm: UntypedFormGroup = new FormGroup({});

  public dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private avatarByIdService = inject(AvatarByIdService);
  private avatarDeleteService = inject(AvatarDeleteService);

  constructor() {
    super(
      'Avatar',
      'Create',
      'Update'
    );
  }

  ngOnInit(): void {
    if(this.mode() === 'update') {
      this.isUpdateMode.set(true);
      this.service().targetId.set(this.id());
    } else {
      this.isUpdateMode.set(false);
    }    

    this.avatarPersonForm = this.fb.group({
      name: ['', Validators.required],
      age: [18, [Validators.required, Validators.min(18), Validators.max(35)]]
    });

    this.avatarCharacteristicForm = this.fb.group({
      hairColor: ['', Validators.required],
      eyeColor: ['', Validators.required],
      hasEarrings: [false]
    });
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
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }

  removeImage(): void {
    this.previewImageData.set('');
  }  

  submit(): void {
    if(this.avatarPersonForm.valid && this.avatarCharacteristicForm.valid) {
      const avatarPerson: AvatarPerson = Object.assign(this.avatarPersonForm.value);
      const avatarCharacteristics: AvatarCharacteristic = Object.assign(this.avatarCharacteristicForm.value);
      const avatarImage: AvatarImage = {
        base64: this.previewImageData()
      };

      avatarPerson.avatarCharacteristic = avatarCharacteristics;
      avatarPerson.avatarImage = avatarImage;

      if(this.isUpdateMode() && this._updateData()) {
        avatarPerson.id = this._updateData()!.id;
        avatarPerson.avatarCharacteristic.id = this._updateData()!.avatarCharacteristic?.id ?? 0;
        avatarPerson.avatarImage.id = this._updateData()!.avatarImage?.id ?? 0;
      }

      this.entity.set(avatarPerson);

      if(this.isUpdateMode()) {
        this.method.set('PUT');
      } else {
        this.method.set('POST');
      }
    } else {
      this.avatarPersonForm.markAllAsTouched();
      this.avatarCharacteristicForm.markAllAsTouched();
      this.toastr.error('Forms invalid');
    }
  }

  deleteAvatar(): void {
    if(this._updateData()) {
      this.dialogData.dialogMessage = 'Do you want to delete the Avatar below?';
      this.dialogData.dialogAdditionalText = `Avatar: ${this._updateData()!.name} - Age: ${this._updateData()!.age}`;  
      this.showDialog.set(true);
    }   
  }

  execDelete($event: boolean): void {
    this.dialogData.dialogMessage = '';
    this.dialogData.dialogAdditionalText = '';  
    this.showDialog.set(false);

    if($event) {
      this.avatarDeleteService.targetId.set(this.id());      
    }    
  }

  private loadImagePreview(base64string: string): void {
    this.previewImageData.set(base64string);
  }

  private service() : AvatarByIdService {
    return this.avatarByIdService;
  }

}