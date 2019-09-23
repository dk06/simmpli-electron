import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from './service/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('scrollMe') private elementRef: ElementRef;

  title = 'simmpli-electron';
  userList: any = [];
  messageSpecific: any = [];
  selectedUser = 'deepak';
  message = '';
  username: any = '';
  channel: any = { 'rooms': 'w3channel' };
  typingStatus: boolean = false;

  constructor(private chatService: ChatService) {

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
        this.typingStatus = false;
      });

    this.chatService.getChannelMsg(this.channel)
      .subscribe((msg: string) => {
        alert(msg);
      });

    this.chatService.typingUser()
      .subscribe((msg: string) => {
        this.typingStatus = true;
        setTimeout(() => {
          this.typingStatus = false;
        }, 2000);
      });

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
    this.typingStatus = false;
    console.log('msg', msg);
  }

  selecteUser(id) {
    this.selectedUser = id;
  }


  typingMsg() {
    setTimeout(() => {
      this.chatService.typingMsg(this.selectedUser);
    }, 2000);
  }

  scrollToBottom(): void {
    try {
      this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
