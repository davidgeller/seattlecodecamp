import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Events } from '@ionic/angular';
import { GlobalsService } from '../globals.service';
import { LoadingIndicator } from '../custom/loading';
import { ActionSheetController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  image: any = null;
  loading: LoadingIndicator;
  last_upload_path: string = '';

  constructor(private router: Router,
    private afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private globals: GlobalsService,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private events: Events) {


    this.loading = new LoadingIndicator(loadingController);

    // listen for a message indicating that a new
    // photo is available
    events.subscribe('photo_ready', (results: any) => {
      console.log('capture image data available');
      this.image = this.globals.getPhoto();
    });
  }


  // --------------------------------------------------------
  // Logout of application
  // --------------------------------------------------------
  logout() {
    console.log('Logout pressed!');
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  // --------------------------------------------------------
  // Go take a picture (or select one if in browser)
  // --------------------------------------------------------
  capture() {
    this.router.navigate(['/PhotoCapture']);
  }

  // --------------------------------------------------------
  // Save our image to Firebase
  // --------------------------------------------------------
  saveImage() {
    console.log('Saving image to Firebase...');

    this.loading.startWaiting('Uploading image to Firebase...');

    const img_data = this.convertb64ImageToBlob(this.image);

    // help create a semi-unique file name
    const time = new Date().getTime();

    this.uploadImageFileToStore('/captured_image_' + time + '.jpg', img_data).then((p) => {
      this.last_upload_path = p;
      console.log('Finished uploading image. Path: ' + this.last_upload_path);
      this.loading.stopWaiting();
      this.offerToDisplayImage();
    }).catch(() => {
      this.loading.stopWaiting();
    })
  }

  // --------------------------------------------------
  // Offer to display image in another window
  // --------------------------------------------------
  async offerToDisplayImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Display Image',
      buttons: [{
        text: 'Yes',
        handler: () => {
          console.log('Yes clicked');
          this.openImageInNewWindow();
        }
      }, {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  // --------------------------------------------------
  // Open up our image in a new window
  // --------------------------------------------------
  openImageInNewWindow() {
    window.open(this.last_upload_path, '_blank');
  }

  // --------------------------------------------------
  // Upload a file to storage
  // --------------------------------------------------
  uploadImageFileToStore(path: string, data): Promise<any> {
    return new Promise((resolve, reject) => {

      let fileRef = this.afStorage.ref(path);
      let uploadTask: AngularFireUploadTask = fileRef.put(data);

      uploadTask.then(snapshot => {
        const metadata: any = snapshot.metadata;
        console.log('Image metadata: ' + JSON.stringify(snapshot.metadata));
        resolve(snapshot.ref.getDownloadURL());
      });
    });
  }

  // ------------------------------------------------------------------
  // Convert Base64 encoded block to an image blob
  // ------------------------------------------------------------------
  convertb64ImageToBlob(image_data: string): Blob {

    let block = image_data.split(";");

    // get content type
    let contentType = block[0].split(":")[1];

    // console.log ('contentType: ' + contentType);

    // get the real base64 content
    let realData = block[1].split(",")[1];

    // console.log ('Converting to blob...');
    let blob = this.b64toBlob(realData, contentType);

    return blob;
  }

  // ------------------------------------------------------------------
  // Convert base64 to blob
  //
  // see: https://ourcodeworld.com/articles/read/322/how-to-convert-a-base64-image-into-a-image-file-and-upload-it-with-an-asynchronous-form-using-jquery
  //
  // ------------------------------------------------------------------
  b64toBlob(b64Data, contentType, sliceSize?): Blob {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
