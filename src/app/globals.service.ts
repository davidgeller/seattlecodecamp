import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  image: any = null;

  constructor() { }

  setPhoto (data: any) {
    console.log ("Saved image");
    this.image = data;
  }

  getPhoto (): any {
    console.log ("Retrieved image");
    return this.image;
  }

  hasPhoto ():boolean {
    return (this.image != null);
  }
}
