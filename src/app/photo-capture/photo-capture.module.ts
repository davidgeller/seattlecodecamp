import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PhotoCapturePage } from './photo-capture.page';

// -------- this is for our image cropping service --------
import { AngularCropperjsModule } from 'angular-cropperjs';

const routes: Routes = [
  {
    path: '',
    component: PhotoCapturePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularCropperjsModule
  ],
  declarations: [PhotoCapturePage]
})
export class PhotoCapturePageModule {}
