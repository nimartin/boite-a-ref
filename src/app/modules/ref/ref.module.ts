import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefRoutingModule } from './ref-routing.module';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { RefUploadComponent } from './ref-upload/ref-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RefModalComponent } from './ref-upload/ref-modal/ref-modal.component';
import { RefTutoComponent } from './ref-tuto/ref-tuto.component';

@NgModule({
  declarations: [RefUploadComponent],
  imports: [
    CommonModule,
    RefRoutingModule,
    AngularSvgIconModule.forRoot(),

    NgxSkeletonLoaderModule.forRoot(),
    ReactiveFormsModule,
    ButtonComponent,
    RefModalComponent,
    RefTutoComponent
  ]
})
export class RefModule { }
