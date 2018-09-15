
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

export class LoadingIndicator {

    loading;

    constructor(public loadingController: LoadingController) {}

    async startWaiting (msg: string) {
    this.loading = await this.loadingController.create({
        message: msg,
        duration: 2000
      });
      return await this.loading.present();
    }

    stopWaiting() {
        if (this.loading)
            this.loading.dismiss();
    }
}