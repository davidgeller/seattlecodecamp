import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(private navCtrl: NavController,
              private formBuilder: FormBuilder) { 
    // prepare form
    this.registerForm = formBuilder.group({
      formUser: ['', Validators.required],
      formPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  // ------------------------------------------------------------------
  // Handle signup
  // ------------------------------------------------------------------
  signup() {
    console.log ("Register button pressed");
  }

  // ------------------------------------------------------------------
  // Show a message
  // ------------------------------------------------------------------
  async showMessage(message_title, text) {

    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();

    const alert = await alertController.create({
      header: message_title,
      subHeader: text,
      buttons: ['OK']
    });
    
    return await alert.present ();
  }

  gotoLogin () {
    console.log ('Go back to our login page...');
  }

}
