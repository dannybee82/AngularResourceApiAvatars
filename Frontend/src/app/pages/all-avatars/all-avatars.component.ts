import { Component, OnInit } from '@angular/core';
import { AvatarPerson } from '../../models/avatar/avatar-person.interface';
import { FiltersComponent } from '../../components/filters/filters.component';
import { FilterData } from '../../models/filter/filter-data.interface';
import { GenericsByParamsClass } from '../../services/generics/by_params/generics-by-params.abstract';
import { AllMaterialsModule } from '../../all-materials.module';
import { RouterLink } from '@angular/router';
import { ScrollToTopComponent } from '../../components/scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'app-all-avatars',
  imports: [
    FiltersComponent,
    AllMaterialsModule,
    RouterLink,
    ScrollToTopComponent
  ],
  templateUrl: './all-avatars.component.html',
  styleUrl: './all-avatars.component.scss'
})
export class AllAvatarsComponent extends GenericsByParamsClass<AvatarPerson> implements OnInit {

  constructor() {
    super(
      'Avatar',
      'GetAll',
      'Filter'
    );
  }

  ngOnInit(): void {
    if(this.data()) {
      this.reload();
    }    
  }

  filterAvatars($event: FilterData | undefined): void {
    if($event) {
      this.targetParams.set($event);
      this.reload();
    } else {
      this.targetParams.set(undefined);
      this.reload();
    }
  }

}
