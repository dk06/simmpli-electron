import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { CommonService } from './service/common.service';
import { ApiService } from './service/api.service';
import $ from 'jquery';
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
    private api: ApiService
  ) {

  }
  ngOnInit() {
    w3channel.bindEvent('new-user', (userDetails) => {
      console.log('new user logged in');
      this.user.online = true;
      // const index = this.directMsg.findIndex((user) => {
      //   return (user.id == userDetails.id);
      // });
    })

    this.commonService.loggedIn.subscribe((val: boolean) => {
      this.isLoggedIn = val;

      if (this.isLoggedIn) {
        this.user = JSON.parse(localStorage.getItem("user"));

        this.getChannels();
        this.getUsers();
      } else {
        this.route.navigate(['/login']);
      }
    });

    this.commonService.selectCuttentUser.subscribe((val: number) => {
      this.selectedId = val;
    });
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

        this.currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));
        if (this.currentChannel) {

          this.commonService.selectUser(this.currentChannel.channel_profiles[0].profile_id);
        }

        this.publicChannels = await filter;
        // this.currentChannelFind();

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
      }
    }, error => {
      console.log('error', error);
    })
  }

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
    this.commonService.callChatData(anotherUser.id);
  };


  currentChannelFind() {
    var currentChannel = JSON.parse(localStorage.getItem('last_active_channel'));
    if (currentChannel) {
      this.transitionToDM(currentChannel.profile_id);
    }

  }

  transitionToDM(anotherUser) {
    this.commonService.selectUser(anotherUser.id);
    let findChannel = this.actualChannels.find(i => i.channel_type == "private" && i.channel_profiles[0].profile_id == anotherUser.id);

    if (findChannel) {
      localStorage.setItem('last_active_channel', JSON.stringify(findChannel));
      this.commonService.callChatData(findChannel.id);
    }
  }

}
