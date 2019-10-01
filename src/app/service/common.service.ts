import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
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

  public noise = new Audio();

  public online: Observable<any>;
  public offline: Observable<any>;


  constructor(
    private http: Http,
    private chatService: ChatService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrManager
  ) {

    this.noise.src = '../../assets/sounds/to-the-point.mp3';
    this.noise.load();
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
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      let myNotification = new Notification(title, {
        body: body,
        icon: '../../assets/image/simmpli-64x64.png',
        dir: 'ltr'
      });

      console.log(myNotification);
      this.noise.play();
    }
  };

  showSuccess(msg) {
    this.toastr.successToastr(msg, 'Success!');
  }

  showError(msg) {
    this.toastr.errorToastr(msg, 'Oops!');
  }

  showWarning(msg) {
    this.toastr.warningToastr(msg, 'Alert!');
  }

  showInfo(msg) {
    this.toastr.infoToastr(msg, 'Info');
  }

  showToast(position: any = 'top-left') {
    this.toastr.infoToastr('This is a toast.', 'Toast', {
      position: position
    });
  }
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
