import { Component, input, InputSignal, OnInit } from '@angular/core';
import { AvatarPerson } from '../../models/avatar/avatar-person.interface';
import { GenericsByIdClass } from '../../services/generics/by_id/generics-by-id.abstract';
import { AllMaterialsModule } from '../../all-materials.module';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-avatars-details',
  imports: [
    AllMaterialsModule,
    TitleCasePipe
  ],
  templateUrl: './avatars-details.component.html',
  styleUrl: './avatars-details.component.scss'
})
export class AvatarsDetailsComponent extends GenericsByIdClass<AvatarPerson> implements OnInit {

  readonly id: InputSignal<number> = input.required();
  
  constructor() {
    super(
      'Avatar',
      'GetById',
      undefined
    );
  }

  ngOnInit(): void {
    this.targetId.set(this.id());
  }

}