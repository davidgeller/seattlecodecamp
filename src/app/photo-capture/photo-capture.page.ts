import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Events, LoadingController } from '@ionic/angular';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import fixOrientation from 'fix-orientation';
import { GlobalsService } from '../globals.service';
import { Router } from '@angular/router';
import { LoadingIndicator } from '../custom/loading';

export enum CROPPING_OPTIONS {
  aspect_ratio_1x1 = 0,
  aspect_ratio_4x3,
  aspect_ratio_2x3,
  aspect_ratio_16x9
}

@Component({
  selector: 'app-photo-capture',
  templateUrl: './photo-capture.page.html',
  styleUrls: ['./photo-capture.page.scss'],
})
export class PhotoCapturePage implements OnInit {

  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  @ViewChild('inputcamera') cameraInput: ElementRef;
  img = '';
  croppedImage = '';

  image_captured: boolean = false;
  crop_image: boolean = true;
  crop_aspect_ratio: number = CROPPING_OPTIONS.aspect_ratio_4x3;
  crop_max_width: number = 0;

  DEFAULT_1x1_MAX_WIDTH: number = 800;
  DEFAULT_4x3_MAX_WIDTH: number = 1200;
  DEFAULT_16x9_MAX_WIDTH: number = 1920;
  DEFAULT_2x3_MAX_WIDTH: number = 600;

  cropperOptions: any;
  scaleValX = 1;
  scaleValY = 1;
  finalImgHeight: number = 0;
  finalImageWidth: number = 0;

  loading:LoadingIndicator;
  
  constructor(private router: Router,
    private globals: GlobalsService,
    private loadingController: LoadingController,
    private events: Events) {
    this.loading = new LoadingIndicator(loadingController);

    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.95
    }

    switch (this.crop_aspect_ratio) {
      case CROPPING_OPTIONS.aspect_ratio_1x1:
        this.cropperOptions.aspectRatio = 1;
        this.finalImageWidth = this.crop_max_width ? this.crop_max_width : this.DEFAULT_1x1_MAX_WIDTH;
        this.finalImgHeight = this.finalImageWidth;
        break;

      case CROPPING_OPTIONS.aspect_ratio_4x3:
        this.cropperOptions.aspectRatio = 4 / 3;
        this.finalImageWidth = this.crop_max_width ? this.crop_max_width : this.DEFAULT_4x3_MAX_WIDTH;
        this.finalImgHeight = this.finalImageWidth / this.cropperOptions.aspectRatio;
        break;

      case CROPPING_OPTIONS.aspect_ratio_2x3:
        this.cropperOptions.aspectRatio = 2 / 3;
        this.finalImageWidth = this.crop_max_width ? this.crop_max_width : this.DEFAULT_1x1_MAX_WIDTH;
        this.finalImgHeight = this.finalImageWidth / this.cropperOptions.aspectRatio;
        break;

      case CROPPING_OPTIONS.aspect_ratio_16x9:
        this.cropperOptions.aspectRatio = 16 / 9;
        this.finalImageWidth = this.crop_max_width ? this.crop_max_width : this.DEFAULT_1x1_MAX_WIDTH;
        this.finalImgHeight = this.finalImageWidth / this.cropperOptions.aspectRatio;
        break;
    }

  }

  // --------------------------------------------------
  // What to do when the page first loads
  // --------------------------------------------------
  ngOnInit() {

    const element = this.cameraInput.nativeElement as HTMLInputElement;
    element.onchange = () => {

      console.log("Capturing image...");
      this.loading.startWaiting('Capturing image...');
      const reader = new FileReader();

      reader.onload = (r: any) => {
        //THIS IS THE ORIGINAL BASE64 STRING AS SNAPPED FROM THE CAMERA
        //THIS IS PROBABLY THE ONE TO UPLOAD BACK TO YOUR DB AS IT'S UNALTERED
        //UP TO YOU, NOT REALLY BOTHERED
        let base64 = r.target.result as string;

        //FIXING ORIENTATION USING NPM PLUGIN fix-orientation
        fixOrientation(base64, { image: true }, (fixed: string, image: any) => {
          //fixed IS THE NEW VERSION FOR DISPLAY PURPOSES
          this.img = fixed;
          this.image_captured = true;
          console.log("Image captured!");
          this.loading.stopWaiting();
        });
      };
      reader.readAsDataURL(element.files[0]);
    };
  }

  // --------------------------------------------------
  // Capture an image
  // --------------------------------------------------
  capture() {
    this.image_captured = false;
    this.cameraInput.nativeElement.click();
  }

  // --------------------------------------------------
  // Return back to our home page
  // --------------------------------------------------
  cancel() {
    this.router.navigate(['home']);
  }

  displayCard() {
    return this.img !== '';
  }

  // --------------------------------------------------
  // User accepts the image
  // --------------------------------------------------
  acceptImage() {
    console.log("accepting image...");

    if (this.crop_image) {
      this.cropSave();
      this.globals.setPhoto(this.croppedImage);
    }
    else {
      // store our image data in caller's nav data stack
      this.globals.setPhoto(this.img);
    }

    this.events.publish('photo_ready');
    this.router.navigate(['home']);
  }

  // --------------------------------------------------
  // Reset our cropping
  // --------------------------------------------------
  cropReset() {
    this.angularCropper.cropper.reset();
  }

  // --------------------------------------------------
  // Clear our cropping
  // --------------------------------------------------
  cropClear() {
    this.angularCropper.cropper.clear();
  }

  // --------------------------------------------------
  // Rotate our image
  // --------------------------------------------------
  cropRotate() {
    this.angularCropper.cropper.rotate(90);
  }

  // --------------------------------------------------
  // Zoom-in
  // --------------------------------------------------
  cropZoom(zoom_in: boolean) {
    let factor = zoom_in ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  // --------------------------------------------------
  // X scaling
  // --------------------------------------------------
  cropScaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  // --------------------------------------------------
  // Y scaling
  // --------------------------------------------------
  cropScaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  // --------------------------------------------------
  // Move image
  // --------------------------------------------------
  cropMove(x, y) {
    this.angularCropper.cropper.move(x, y);
  }

  // --------------------------------------------------
  // Save our cropped image
  // --------------------------------------------------
  cropSave() {
    let croppedImageBase64: string = this.angularCropper
      .cropper
      .getCroppedCanvas({ width: this.finalImageWidth, height: this.finalImgHeight })
      .toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImageBase64;
  }

}
