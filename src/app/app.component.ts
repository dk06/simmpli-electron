import { Component } from '@angular/core';
import { ChatService } from './service/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simmpli-electron';
  userList: any = [];
  messageSpecific: any = [];
  selectedUser = 'deepak';
  message = '';
  username: any = '';
  channel: any = { 'rooms': 'w3channel' };

  constructor(private chatService: ChatService) {

  }

  sendMessage() {
    this.chatService.sendMessage();
  }

  connectUser() {
    this.chatService.connectUser(this.username);
  }

  connectChannel() {
    this.chatService.connectChannel(this.channel);
  }

  sendMsgToSpecific() {
    var msg = this.chatService.sendMsgToSpecific(this.selectedUser, this.message, this.username);
    this.message = '';
    console.log('msg', msg);
  }

  selecteUser(id) {
    this.selectedUser = id;
  }

  ngOnInit() {
    this.chatService.getMessage()
      .subscribe((msg: string) => {
        this.message = msg;
      });

    this.chatService.getUserList()
      .subscribe((userList: any) => {
        this.userList = userList;
      });

    this.chatService.getMsgToSpecific()
      .subscribe((msg: string) => {
        this.messageSpecific.push(msg);
      });

    this.chatService.getChannelMsg(this.channel)
      .subscribe((msg: string) => {
        alert(msg);
      });

  }
}
