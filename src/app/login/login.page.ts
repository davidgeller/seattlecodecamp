import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
// import firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private alertCtrl: AlertController,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private afAuth: AngularFireAuth) {

    this.loginForm = formBuilder.group({
      formUser: ['', Validators.required],
      formPassword: ['', Validators.required]
    });

    this.isLoggedIn().then ((u) => {
      console.log ("We're already logged in!");
      this.router.navigate (['/home']);
    });

  }

  ngOnInit() {
  }

  // --------------------------------------------------------
  // Login using Firebase credentials
  // --------------------------------------------------------
  login () {
    console.log ('Login button pressed');

    const user: string = this.loginForm.value.formUser;
    const pwd: string = this.loginForm.value.formPassword;

    if (user === null || user.length === 0 || pwd === null || pwd.length === 0) {
      this.showMessage('Error', 'Please be sure to provide both a user name and password in order to login. Neither field can be empty.');
      return;
    }

    // sign-in through the Firebase platform
    this.afAuth.auth.signInWithEmailAndPassword (user, pwd).then ((auth_data) => {
      console.log ("We have logged in using " + user);
      this.router.navigate (['/home']);
    },
    error => {
      this.showMessage('Login Error', error.message);
      console.log ('Error: ' + error.message);
    }).catch (e => {
      console.error (e);
    });
  }

  register () {
    console.log ('Register button pressed');
  }

  // --------------------------------------------------------
  // Are we logged in?
  // --------------------------------------------------------
  isLoggedIn(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe(user => {
        // console.log('user: ' + JSON.stringify(user));
        if (user != null) {
          resolve(user);
        } else {
          reject(null);
        }
      });
    });
  }

  // --------------------------------------------------------
  // Ask Firebase to help us reset our password
  // --------------------------------------------------------
  resetPassword () {
    console.log ('Reset password button pressed');

    const email: string = this.loginForm.value.formUser;
    if (email === null || email.length === 0) {
      this.showMessage ("Missing Email", "Please enter your email address for your account in order to recover your password.");
      return;
    }

    this.afAuth.auth.sendPasswordResetEmail(email).then (() => {
      this.showMessage ("Password Reset Message Sent", "Please check your email for a link to reset your password.");
    });
  }

  // --------------------------------------------------------
  // Display a message
  // --------------------------------------------------------
  async showMessage (msg: string, sub: string) {
    const alert = await this.alertCtrl.create({
      header: msg,
      message: sub,
      buttons: ['OK']
    });
  
    await alert.present();
  }

}
