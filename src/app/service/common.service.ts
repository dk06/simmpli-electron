import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/fromEvent";
import { ChatService } from './chat.service';



@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getChatData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public selectCuttentUser: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  public online: Observable<any>;
  public offline: Observable<any>;


  constructor(
    private http: Http,
    private chatService: ChatService,
    private spinner: NgxSpinnerService
  ) {

    this.online = Observable.fromEvent(window, 'online');
    this.offline = Observable.fromEvent(window, 'offline');
    console.log("connected Login");
  }

  setCurrentUser(user) {
    //connect to notification server
    this.chatService.push('simmpli-chat', 'new-user', {
      id: user.current_profile.id,
      name: user.current_profile.full_name
    });
    this.loggedIn.next(true);
  }

  callChatData(channel) {
    this.getChatData.next(channel);
  }

  selectUser(id) {
    this.selectCuttentUser.next(id);
  }

  notify(type, title, body) {
    console.log('Notification: ', type, title, body);

    // toaster.pop({
    //     type: 'success',
    //     title: title,
    //     body: body
    // });

    let myNotification = new Notification(title, {
      body: body
    });

    console.log(myNotification);
    // console.log('/simmpli-electron/app/assets/sounds/to-the-point.mp3');
    // const noise = new Audio('/simmpli-electron/app/assets/sounds/to-the-point.mp3');
    // noise.play();
  };

  loaderShow() {
    this.spinner.show();
  }

  loaderHide() {
    this.spinner.hide();

  }

  logout() {

    this.loggedIn.next(false);

  }
}
