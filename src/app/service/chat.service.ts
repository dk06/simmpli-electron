import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";


declare var require: any;
const config = require('../w3socket.config.json');

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

declare var W3sockets: any;
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hostUrl = "https://www.w3sockets.com"
  private socket;

  publicKey = "";
  secretKey = "";
  grantType = "client_credentials";

  socketId: any = null;

  constructor(private http: Http) {
    console.log('w3sockets initialized');

    this.publicKey = config.production.public_key;
    this.secretKey = config.production.secret_key;
  }

  getSecretKeys() {
    return this.http.get('./w3socket.config.json').map(res => res.json());


  }

  getAccessToken = function () {

    var accessTokenOptions = {
      url: `${this.hostUrl}/oauth/token`,
      form: {
        client_id: this.publicKey,
        client_secret: this.secretKey,
        grant_type: this.grantType
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    return this.http.post(accessTokenOptions.url, accessTokenOptions.form, accessTokenOptions.headers).map(res => res.json());
  };

  pushToServer(channel, event, message, accessToken) {
    var data = {
      channel: `${this.publicKey}-${channel}`,
      event: event,
      message: message
    };

    var pushOptions: any = {
      url: `${this.hostUrl}/api/v1/push/notify`,
      form: {
        access_token: accessToken,
        data: data
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    return this.http.post(pushOptions.url, pushOptions.form, pushOptions.headers).map(res => res.json());
  };

  push(channel, event, message) {
    let ref = this;
    return ref.getAccessToken().subscribe((accessToken) => {
      if (accessToken) {
        ref.pushToServer(channel, event, message, accessToken.access_token).subscribe((res) => {
          if (res.success) {
            console.log(res)
            console.log(`Notification Sent`);
          } else {
            console.log(`Some Error :`, res);
          }
        });
      } else {
        console.log('Error connecting: ', accessToken);
      }
    }, error => {
      console.log('error', error);
    });
  };

  // connectUser = (username) => {
  //   this.socket.emit('username', username);
  // }

  // connectChannel = (event) => {
  //   this.socket.emit('join', event);
  // }

  // getChannelMsg(event) {
  //   return Observable.create((observer) => {
  //     this.socket.on(event.room, (data) => {
  //       observer.next(data);
  //     });
  //   });
  // }

  // getUserList = () => {
  //   return Observable.create((observer) => {
  //     this.socket.on('userList', (userList, socketId) => {
  //       if (this.socketId === null) {
  //         this.socketId = socketId;
  //       }
  //       observer.next(userList);
  //     });
  //   });
  // }

  // sendMsgToSpecific = (selectedUser, message, username) => {
  //   this.socket.emit('getMsg', {
  //     toid: selectedUser,
  //     msg: message,
  //     name: username
  //   });
  // };

  // getMsgToSpecific() {
  //   return Observable.create((observer) => {
  //     this.socket.on('sendMsg', (data) => {
  //       observer.next(data);
  //     });
  //   });
  // }

  // sendMessage() {
  //   this.socket.emit('new-message-from', 'deepak');
  // }

  // getMessage = () => {
  //   return Observable.create((observer) => {
  //     this.socket.on('new-message-to', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }

  // typingMsg = (selectedUser) => {
  //   this.socket.emit('typing', { toid: selectedUser });
  // }

  // typingUser = () => {
  //   return Observable.create((observer) => {
  //     this.socket.on('typing-event', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }
}
