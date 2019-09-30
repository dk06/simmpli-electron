import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { CommonService } from './service/common.service';
import { ApiService } from './service/api.service';
import $ from 'jquery';
import { ChatService } from './service/chat.service';
declare var w3channel: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoggedIn: boolean;

  mentionSearch = "";
  selectedId: number = 0;
  channels = [];
  user: any;
  urlBase = localStorage.getItem("urlBase");
  currentChannel: any;
  filteredUsers: any;
  publicChannels: any;
  actualChannels: any;

  constructor(
    private commonService: CommonService,
    private route: Router,
    private api: ApiService,
    private chatService: ChatService,
    private ref: ChangeDetectorRef
  ) {
    setTimeout(() => {

    }, 3000);
  }
  ngOnInit() {
    this.checkUser();
    this.commonService.online.subscribe(() => {
      $('#networkCheck').removeClass('disable-div');
    });

    this.commonService.offline.subscribe(() => {
      $('#networkCheck').addClass('disable-div');
      this.checkUser();
    });

    w3channel.bindEvent('new-user', (userDetails) => {
      console.log('new user logged in', userDetails);
      this.user.online = true;

      let index = this.filteredUsers.findIndex(i => i.id == userDetails.id);
      if (index >= 0) {
        this.filteredUsers[index].online = true;
        this.ref.detectChanges();
      }

    });

    this.commonService.loggedIn.subscribe((val: boolean) => {
      this.isLoggedIn = val;

      if (this.isLoggedIn) {
        this.user = JSON.parse(localStorage.getItem("user"));

        this.getChannels();
        this.getUsers();
      }
    });

    this.commonService.selectCuttentUser.subscribe((val: number) => {
      this.selectedId = val;
      this.route.navigate(['/chat-room']);
    });
  }

  checkUser() {
    this.user = JSON.parse(localStorage.getItem("user"));

    if (this.user) {
      this.commonService.setCurrentUser(this.user);
    } else {
      this.route.navigate(['/login']);
    }
  }


  logOut() {
    this.commonService.logout();
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  getChannels() {
    this.api.getChannels().subscribe(async (response) => {
      if (response.success) {
        var filter = [];
        this.actualChannels = response.channels;
        await response.channels.map((channel) => {
          if (channel.channel_type !== "private") {
            if (channel.name.split(',')[1]) {
              channel.name = channel.name.split(',')[1];
            }
            filter.push(channel);
          }
        });
        this.commonService.loaderHide();

        this.currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));
        if (this.currentChannel) {

          this.commonService.selectUser(this.currentChannel.channel_profiles[0].profile_id);
        }

        this.publicChannels = await filter;
      }
    }, error => {
      console.log('error', error);
    });
  }

  getUsers() {
    this.api.getUsers().subscribe(async (response) => {
      if (response.success) {
        this.filteredUsers = await response.profiles.filter((user) => {
          return (this.user.current_profile.id != user.id);
        });

        this.filteredUsers.forEach(element => {
          element.online = false;
        });
      }
    }, error => {
      console.log('error', error);
    });
  }

  createNewChannel() {
    this.route.navigate(['/creat-channel', { queryParams: JSON.stringify(this.filteredUsers) }]);
  }


  activeStyle = {
    "background": "rgba(0,0,0,0.5)",
    "color": "#e6e6e6",
    "font-weight": "bold"
  };


  transitionToCreateChannel = function () {
    // $state.go("dashboard.new-channel", {
    //   profiles: directMsg
    // });
  };

  goBack = () => {
    // $state.go("dashboard.channel-chat-window", {
    //   channelId: $rootScope.currentChannel.id,
    //   channel: $rootScope.currentChannel
    // });
  }

  toggleModal = (id, bool) => {
    // console.log(id);
    // if (bool) {
    //   $(id).modal('show');
    // } else {
    //   $(id).modal('hide');
    // }
  }

  transitionToChannel(anotherUser) {
    console.log('00')
    this.commonService.selectUser(anotherUser.id);

    localStorage.setItem('last_active_channel', JSON.stringify(anotherUser));
    this.commonService.callChatData(anotherUser);
  };


  transitionToDM(anotherUser) {
    this.commonService.selectUser(anotherUser.id);
    const channel = this.actualChannels.find((channel) => {
      if (channel.channel_profiles.length == 2) {
        if (channel.channel_type == "private" && channel.channel_profiles[0].profile_id == anotherUser.id || channel.channel_profiles[1].profile_id == anotherUser.id) {
          return channel;
        }
      } else {
        if (channel.channel_type == "private" && channel.channel_profiles.length == 1 && channel.channel_profiles[0].profile_id == anotherUser.id) {
          return channel;
        }
      }
    });

    if (channel) {
      localStorage.setItem('last_active_channel', JSON.stringify(channel));
      this.commonService.callChatData(channel);
    } else {
      this.createChannel(anotherUser);
    }

  }

  createChannel(anotherUser) {
    console.log("channel needs to be created");
    var newChannel = {
      conversation_type: "channel",
      channel_type: "private",
      name: `${this.user.current_profile.full_name}, ${
        anotherUser.full_name
        }`,
      purpose: `Direct Messaging with ${anotherUser.full_name}`,
      channel_profiles_attributes: [{
        profile_id: anotherUser.id,
        active: true
      }]
    };
    this.commonService.loaderShow();
    this.api.createChannel(newChannel).subscribe(async (res) => {
      if (res.success) {
        console.log("channel for DM created successfully");

        this.currentChannel = res.channel;

        localStorage.setItem('last_active_channel', JSON.stringify(this.currentChannel));
        await res.channel.channel_profiles.forEach(profile => {
          console.log(`pushing on: new-message-${profile.profile_id}`)
          this.chatService.push(`simmpli-chat`, `new-channel-${profile.profile_id}`, {
            message: "You got added to a new channel",
            channel: this.currentChannel
          });
        });
        this.commonService.loaderHide();

        this.getChannels();

        await this.commonService.callChatData(res.channel.id);
        // $state.go("dashboard.channel-chat-window", {
        //   channelId: res.id,
        //   channel: res
        // });
      } else {
        this.commonService.loaderHide();
        console.log('error');
      }
    }, error => {
      this.commonService.loaderHide();

      console.log('error', error);
    });
  }

}
