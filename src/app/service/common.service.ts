import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getChatData: BehaviorSubject<any> = new BehaviorSubject<any>(0);


  constructor(private http: Http) {
    console.log("connected Login");
  }

  setCurrentUser() {
    this.loggedIn.next(true);
  }

  getChatDataResponse(channelId) {
    this.getChatData.next(channelId);
  }

  logout() {

    this.loggedIn.next(false);

  }
}
