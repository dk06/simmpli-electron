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
  message = 'hello';
  username = 'deepak kumar';

  constructor(private chatService: ChatService) {

  }

  sendMessage() {
    this.chatService.sendMessage();
  }

  connectUser() {
    this.chatService.connectUser();
  }

  sendMsgToSpecific() {
    var msg = this.chatService.sendMsgToSpecific(this.selectedUser, this.message, this.username);
    console.log('msg', msg);
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

  }
}
