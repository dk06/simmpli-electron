import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/service/chat.service';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/api.service';
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
  channel: any = [];
  currentChannel: any;
  publicChannels: any;
  messages: any;
  newMsg = "";
  fileComment = "";
  mentions = [];
  mention = [];
  pageNo = 1;


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

  userId: any;

  constructor(
    private chatService: ChatService,
    private commonService: CommonService,
    private api: ApiService
  ) {

    this.commonService.getChatData.subscribe((channelId: any) => {
      this.currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));

      if (channelId) {
        this.pageNo = 1;

        this.channelId = channelId;
        this.getUserChats(channelId);
      }
    });
    w3channel.bindEvent(`new-message-${this.channelId}`, (message) => {

    });

    w3channel.bindEvent(`new-channel-${this.channelId}`, (data) => {
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
    this.currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));
    if (this.currentChannel) {
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

    this.api.getMessages(channelId, this.pageNo).subscribe((response) => {
      if (response.success) {
        this.noMore = true;
        if (response.messages.length < 20) {
          this.noMore = false;
        }

        this.messages = response.messages;
        this.scrollToBottom();
        // this.messages = this.messages.concat(response.messages);
        this.pageNo++;
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
      } else {
        console.log('error getting new messages');
      }
    }, error => {
      console.log('error', error);
    });
  }


  loadMoreMessages() {
    this.pageNo++;
    this.getUserChats(this.channelId);
  }
  // const flask = new CodeFlask('.code-snippet', {
  //   language: 'js',
  //   lineNumbers: true
  // });
  // // console.log(flask);

  // tickColor = {
  //   color: "red"
  // };




  loadMessages = () => {
    // ChannelService.getMessages(channelId, pageNo, function (err, newmessages) {
    //   if (newmessages) {
    //     if (newmessages.length < 20) {
    //       noMore = false;
    //     }
    //     messages = messages.concat(newmessages);
    //     pageNo++;
    //     messages.forEach((message) => {
    //       message.readBy = [];
    //       message.receivedBy = [];
    //       message.message_profile_statuses.forEach((profile_status) => {
    //         if (profile_status.status === "read")
    //           message.readBy.push(profile_status);
    //         if (profile_status.status === "received")
    //           message.receivedBy.push(profile_status);
    //       });
    //     })
    //   } else {
    //     console.log('error getting new messages');
    //   }
    // });
  }



  sendSnippet = () => {
    // console.log('inside snippet: ', flask.getCode());
  }

  uploadFiles = (files) => {
    // ChannelService.sendFile(channel, fileComment, files, function (err, res) {
    //   if (err) {
    //     console.log('error uploading file : ', err);
    //   } else {
    //     console.log('file uploaded');
    //   }
    // });
    // fileComment = "";
    // $('#shareModal').modal('hide');
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

  checkScroll = () => {
    let list = document.querySelector('.chat-history ul');
    // if (list.scrollHeight < 0.9 * window.innerHeight) {
    //   console.log('inside if');
    //   $(".chat-history ul").css(
    //     'position', 'absolute'
    //   );
    //   $(".chat-history ul").css(
    //     'margin-left', '20px'
    //   );
    // } else {
    //   $(".chat-history ul").css(
    //     'position', 'static'
    //   );
    //   $(".chat-history ul").css(
    //     'margin-left', '0'
    //   );
    // }
  }

  // angular.element(document).ready(function() {
  //   checkScroll();
  //   scrollToBottom();
  // });

  sendMessage = () => {
    console.log(this.mentions);
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
      }
    });
    this.api.sendMessage(this.channelId, this.newMsg, this.mentions).subscribe((response) => {
      if (response.success) {
        console.log("received");
      } else {
        console.log("some error in sedning messages");
      }
    });
    this.newMsg = "";
    this.mentions = [];
  };

  toggleModal() {

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
    }, 300);
  }

}
