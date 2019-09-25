import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
declare var W3sockets: any;
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // private url = 'http://localhost:3000?token=abc';
  // private socket;

  // socketId: any = null;

  // constructor() {
  //   this.socket = io(this.url);
  // }
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

  chat: string;
  w3socket: any;
  dndTime: any = [];
  constructor() {
    // const public_key = '8d957c23bd07b26295fb35077c010681f9db01be7c89674729e22c785211637b';
    // this.w3socket = new W3sockets(public_key);
    // var w3channel = this.w3socket.subscribe('simmpli-chat');
  }
}
