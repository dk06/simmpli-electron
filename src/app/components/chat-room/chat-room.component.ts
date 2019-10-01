import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ChatService } from 'src/app/service/chat.service';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import $ from 'jquery';
import { ModalService } from 'src/app/service/modal.service';

declare var w3channel: any;

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  @ViewChild('scrollMe', { static: false }) private elementRef: ElementRef;

  title = 'simmpli-electron';
  noMore = true;
  urlBase = localStorage.getItem("urlBase");
  channelId: number = 0;
  channel: any;
  currentChannel: any;
  publicChannels: any;
  messages: any = [];
  newMsg = "";
  fileComment = "";
  mentions = [];
  mention = [];
  pageNo = 1;
  urls = new Array<string>();
  uploadedFiles: any;


  currentUser = JSON.parse(localStorage.getItem("user"));
  areaConfig = {
    autocomplete: [{
      words: [/@([A-Za-z]+[_A-Za-z0-9]+)/gi],
      cssClass: 'user'
    }],
    dropdown: [{
      trigger: /@([A-Za-z]+[_A-Za-z0-9]+)/gi,
      list: function (match, callback) {
        //you can search api..
      },
      onSelect: function (item) {
        // user.push(item);
        return item.display;
      },
      mode: 'replace'
    }]
  };
  bodyText: string;

  userId: any;

  constructor(
    private chatService: ChatService,
    private commonService: CommonService,
    private api: ApiService,
    private ref: ChangeDetectorRef,
    private route: Router,
    private modalService: ModalService
  ) {

    this.commonService.getChatData.subscribe((channel: any) => {
      if (channel) {
        this.messages = [];
        this.pageNo = 1;
        this.channel = channel;
        this.channelId = channel.id;
        this.getUserChats(channel.id);
      }
    });

    if (!this.currentUser) {
      this.route.navigate(['/login']);
    }
    w3channel.bindEvent(`new-message-${this.currentUser.current_profile.id}`, async (message) => {

      await this.api.markAsReceived(message.channel_id, message.id).subscribe(async (res) => {
        console.log("response from mark as received: -", res);

      });

      await this.api.markAsRead(message.channel_id).subscribe(async () => {
        console.log('marked as read on same channel');
      });


      this.commonService.notify('success', 'Success', message.body);
      message.profile = message.profile ? message.profile : '';
      this.messages.push(message);
      this.scrollToBottom();
      this.ref.detectChanges();

      console.log('====================================');
      console.log(message);
      console.log('====================================');
    });

    w3channel.bindEvent(`new-message-${this.channelId}`, (message) => {
      console.log('new-message', message);
    });

    w3channel.bindEvent(`new-channel-${this.currentUser.current_profile.id}`, (data) => {
      console.log('new channel created: ', data.message);
      if (data.channel.channel_type === "public") {
        console.log('new channel logged in');
      }
    });

    // w3channel.bindEvent('new-user', (userDetails) => {
    //   console.log('new user logged in');
    // })

  }

  ngOnInit() {
    this.messages = [];
    this.currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));
    if (this.currentChannel) {
      if (this.currentChannel.channel_type == "public") {
        this.commonService.selectUser(this.currentChannel.id);
      } else {
        this.commonService.selectUser(this.currentChannel.channel_profiles[0].profile_id);
      }
      this.channelId = this.currentChannel.id;
      this.ref.detectChanges();
      this.getUserChats(this.currentChannel.id);
    }
  }

  getCurrentChannel() {
    this.currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));
    if (this.publicChannels.length > 0 && !this.currentChannel) {
      this.currentChannel = this.publicChannels[0];
    } else {
      if (this.currentChannel) {
        this.currentChannel = JSON.parse(this.currentChannel);
        if (this.currentChannel.channel_type === 'private') {
          // this.currentChannelDM = this.currentChannel;
        } else {
          // this.currentChannelDM = null;
        }
      } else {
        // this.currentChannelDM = null;
      }
    }
  }
  getUserChats(channelId) {
    if (!channelId) {
      return;
    }
    this.commonService.loaderShow();
    this.currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));

    this.api.getMessages(channelId, this.pageNo).subscribe(async (response) => {
      if (response.success) {
        this.noMore = true;
        if (response.messages.length < 20) {
          this.noMore = false;
        }


        await response.messages.map((msg) => {
          this.messages.push(msg);
        });

        await this.scrollToBottom();
        await this.messages.sort((a, b) => a.id - b.id);
        this.ref.detectChanges();
        // await this.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());



        // this.messages = this.messages.concat(response.messages);
        // this.pageNo++;
        // this.messages.forEach((message) => {
        //   message.readBy = [];
        //   message.receivedBy = [];
        //   message.message_profile_statuses.forEach((profile_status) => {
        //     if (profile_status.status === "read")
        //       message.readBy.push(profile_status);
        //     if (profile_status.status === "received")
        //       message.receivedBy.push(profile_status);
        //   });
        // })
        this.commonService.loaderHide();

      } else {
        this.commonService.loaderHide();

        console.log('error getting new messages');
      }
    }, error => {
      this.commonService.loaderHide();

      console.log('error', error);
    });
  }


  loadMoreMessages() {
    this.pageNo++;
    this.getUserChats(this.channelId);
  }

  detectFiles(event) {
    this.urls = [];
    let files = event.target.files;
    if (files) {
      this.uploadedFiles = files;
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
  }

  sendSnippet = () => {
    // console.log('inside snippet: ', flask.getCode());
  }

  uploadFiles = (modalId) => {
    if (!this.channelId && !this.fileComment && this.uploadedFiles.length) {
      return;
    }
    // this.commonService.loaderShow();

    let message = {
      profile: {
        full_name: this.currentUser.current_profile.full_name,
        dp_url_small: this.currentUser.current_profile.dp_url_small
      },
      body: this.newMsg,
      created_at: new Date(),
      message_attachments: []
    }
    this.messages.push(message);
    this.ref.detectChanges();
    this.scrollToBottom();
    this.modalService.close(modalId);

    this.api.sendFile(this.channelId, this.fileComment, this.uploadedFiles).subscribe((response) => {
      if (response.success) {
        response.message.message_profile_statuses.forEach(element => {
          if (element.profile_id !== this.currentUser.current_profile.id) {
            this.chatService.push(`simmpli-chat`, `new-message-${element.profile_id}`, response.message);
          }
        });
        // this.modalService.close(modalId);

        // response.message.profile = response.message.profile ? response.message.profile : '';
        // this.messages.push(response.message);
        // this.ref.detectChanges();
        // this.scrollToBottom();
        // this.commonService.loaderHide();

        this.fileComment = "";
        console.log('file uploaded');
      } else {
        this.commonService.loaderHide();

        console.log('error uploading file : ');
      }
    }, error => {
      this.commonService.loaderHide();
    });
  }

  // mousetrap.bind(['command+t', 'ctrl+t'], function() {
  //   console.log('shortcut pressed');
  //   $('#dmSearchModal').modal('show');
  // })

  // mousetrap.bind(['command+k', 'ctrl+k'], function() {
  //   console.log('shortcut pressed');
  //   $('#allSearchModal').modal('show');
  // })

  // scrollToBottom = () => {
  //   let obj = document.getElementById("messageBox");
  //   if (obj) {
  //     obj.scrollTop = (obj.scrollHeight * 2);
  //   }
  // };

  sendMessage = () => {
    console.log(this.mentions);
    if (!this.channelId) {
      return;
    }
    this.mentions = this.mentions.filter((mention) => {
      return this.newMsg.includes(`@${mention.full_name}`)
    });
    console.log(this.mentions);
    if (!this.newMsg) {
      return;
    }
    this.mentions = this.mentions.map((mention) => {
      return {
        profile_id: mention.profile_id
      };
    });
    // this.commonService.loaderShow();

    let message = {
      profile: {
        full_name: this.currentUser.current_profile.full_name,
        dp_url_small: this.currentUser.current_profile.dp_url_small
      },
      body: this.newMsg,
      created_at: new Date(),
      message_attachments: []
    }
    this.messages.push(message);
    this.ref.detectChanges();
    this.scrollToBottom();

    this.api.sendMessage(this.channelId, this.newMsg, this.mentions).subscribe((response) => {
      if (response.success) {
        console.log("received");
        response.message.message_profile_statuses.forEach(element => {
          if (element.profile_id !== this.currentUser.current_profile.id) {
            this.chatService.push(`simmpli-chat`, `new-message-${element.profile_id}`, response.message);
          }
        });

        // this.pageNo++;
        // this.getUserChats(this.channelId);
      } else {
        console.log("some error in sedning messages");
      }
      this.newMsg = "";
      this.mentions = [];
    }, error => {
      this.commonService.loaderHide();
      console.log('error', error);
    });

  };

  toggleModal(id, bool) {
    console.log(id);
    if (bool) {
      $(id).modal('show');
    } else {
      $(id).modal('hide');
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  // $scope.$on('addMention', (e, data) => {
  //   const mentionProfileId = {
  //     profile_id: data.id,
  //     full_name: data.full_name
  //   };
  //   let match = $filter('filter')(mentions, {
  //     profile_id: data.id,
  //     full_name: data.full_name
  //   });
  //   if (match.length <= 0)
  //     mentions.push(mentionProfileId);
  // });

  // $scope.$on(`new-message-${channelId}`, (e, message) => {
  //   console.log("message received: ", message);
  //   messages.push(message);
  //   $scope.$apply(messages);
  //   checkScroll();
  //   scrollToBottom();

  // });




  scrollToBottom(): void {
    setTimeout(() => {
      let obj = document.getElementById("messageBox");
      if (obj) {
        obj.scrollTop = (obj.scrollHeight * 2);
      }
    }, 100);
  }

}
