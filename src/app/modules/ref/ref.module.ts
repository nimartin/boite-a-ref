import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefRoutingModule } from './ref-routing.module';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { RefUploadComponent } from './ref-upload/ref-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';

@NgModule({
  declarations: [RefUploadComponent],
  imports: [
    CommonModule,
    RefRoutingModule,
    AngularSvgIconModule.forRoot(),
    ReactiveFormsModule,
    ButtonComponent
  ]
})
export class RefModule { }
