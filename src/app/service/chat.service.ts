import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'https://chat-app-deepak.herokuapp.com/?token=abc';
  private socket;

  socketId: any = null;
  username: any = 'depak kumar';

  constructor() {
    this.socket = io(this.url);
  }
  connectUser = () => {
    this.socket.emit('username', this.username);
  }

  getUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('userList', (userList, socketId) => {
        if (this.socketId === null) {
          this.socketId = socketId;
        }
        observer.next(userList);
      });
    });
  }

  sendMsgToSpecific = (selectedUser, message, username) => {
    this.socket.emit('getMsg', {
      toid: this.socketId,
      msg: message,
      name: username
    });
  };

  getMsgToSpecific() {
    return Observable.create((observer) => {
      this.socket.on('sendMsg', (data) => {
        observer.next(data);
      });
    });

  }

  sendMessage() {
    this.socket.emit('new-message-from', 'deepak');
  }

  getMessage = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message-to', (message) => {
        observer.next(message);
      });
    });
  }

}
