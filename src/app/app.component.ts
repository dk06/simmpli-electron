import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { CommonService } from './service/common.service';
import { ApiService } from './service/api.service';
import $ from 'jquery';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoggedIn: boolean;

  mentionSearch = "";
  selectedId = 0;
  channels = [];
  user: any;
  urlBase = localStorage.getItem("urlBase");
  currentChannel: any;
  filteredUsers: any;
  publicChannels: any;

  constructor(
    private commonService: CommonService,
    private route: Router,
    private api: ApiService
  ) {

  }
  ngOnInit() {
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
        await response.channels.map((channel) => {
          if (channel.name.split(',')[1]) {
            channel.name = channel.name.split(',')[1];
          }
          filter.push(channel);
        });

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
        });;
      }
    }, error => {
      console.log('error', error);
    })
  }
  // privateChannels = channels.filter(channel => {
  //   return !!(channel.channel_type === "private");
  // });
  // publicChannels = channels.filter(channel => {
  //   return !(channel.channel_type === "private");
  // });

  // directMsg = users;
  // user = localStorage.getItem("user");
  // if(!!user) {
  //   user = JSON.parse(user);
  // }

  activeStyle = {
    "background": "rgba(0,0,0,0.5)",
    "color": "#e6e6e6",
    "font-weight": "bold"
  };


  // simmpliChannel.bindEvent('notification', (message) => {
  //   console.log("---------------------------------");
  //   console.log('simmpli notification: ', message);
  //   console.log("---------------------------------");
  //   EventService.notify("success", message.title, message.desc);
  // });



  // filteredUsers = users.filter((user) => {
  //   return (user.current_profile.id != user.id);
  // });

  // W3socketService.push('simmpli-chat', 'new-user', {
  //   id: user.current_profile.id,
  //   name: user.current_profile.full_name
  // });

  // currentChannel = localStorage.getItem('last_active_channel');
  // if(publicChannels.length > 0 && !currentChannel) {
  //   currentChannel = publicChannels[0];
  // } else {
  //   if (currentChannel) {
  //     currentChannel = JSON.parse(currentChannel);
  //     if (currentChannel.channel_type === 'private') {
  //       currentChannelDM = currentChannel;
  //     } else {
  //       currentChannelDM = null;
  //     }
  //   } else {
  //     currentChannelDM = null;
  //   }
  // }
  logout = () => {
    console.log("User is about to logout");
    // localStorage.clear();
    // $state.go("login");
    // // alert('Logout Successful')
    // toaster.pop({
    //   type: 'success',
    //   title: 'Success',
    //   body: 'Logout Successfully'
    // });
    // EventService.notify('success', 'Success', 'Logout Successful');
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
    this.selectedId = anotherUser.id;
    this.commonService.getChatDataResponse(anotherUser.id);
    // $("#allSearchModal").modal('hide');

    // if (channel) {

    //   currentChannel = channel;
    //   localStorage.setItem('last_active_channel', JSON.stringify(currentChannel));
    //   $state.go("dashboard.channel-chat-window", {
    //     channelId: channel.id,
    //     channel: channel
    //   });

    //   if (channel.name.split(',')[1]) {
    //     selectedId = channel.channel_profiles[0].profile_id;
    //   }

    //   if (!channel.name.split(',')[1]) {
    //     selectedId = channel.id;
    //   }
    // } else {
    //   $state.go("dashboard.no-channel");
    // }
  };

  // if (currentChannel) {
  //   currentChannelDM = currentChannel.name.split(',');
  //   if (currentChannelDM[1]) {
  //     currentChannelDM = currentChannelDM[1].trim();
  //   }


  transitionToDM(anotherUser) {
    this.selectedId = anotherUser.id;
    this.commonService.getChatDataResponse(anotherUser.id);
    // $("#dmSearchModal").modal('hide');
    // EventService.busy(true);
    // var existingChannel = null;
    // if (privateChannels) {
    //   existingChannel = privateChannels.find(function (userWithChannel) {
    //     if (anotherUser.id != user.current_profile.id) {
    //       if (userWithChannel.channel_profiles.length > 1) {
    //         let bool = (userWithChannel.channel_profiles[0].profile_id == anotherUser.id ||
    //           userWithChannel.channel_profiles[1].profile_id == anotherUser.id);
    //         return (bool);
    //       }
    //     }
    //     if (userWithChannel.channel_profiles.length == 1) {
    //       return userWithChannel.channel_profiles[0].profile_id == anotherUser.id;
    //     }
    //     return false;
    //   });
    // }
    // if (existingChannel) {
    //   currentChannel = existingChannel;
    //   console.log(currentChannel);
    //   currentChannelDM = currentChannel;
    //   EventService.busy(false);
    //   localStorage.setItem('last_active_channel', JSON.stringify(currentChannel));
    //   $state.go("dashboard.channel-chat-window", {
    //     channelId: existingChannel.id,
    //     channel: existingChannel
    //   });
    // } else {
    //   console.log("channel needs to be created");
    //   var newChannel = {
    //     conversation_type: "channel",
    //     channel_type: "private",
    //     name: `${user.current_profile.full_name}, ${
    //       anotherUser.full_name
    //       }`,
    //     purpose: `Direct Messaging with ${anotherUser.full_name}`,
    //     channel_profiles_attributes: [{
    //       profile_id: anotherUser.id,
    //       active: true
    //     }]
    //   };
    //   ChannelService.createChannel(newChannel, function (err, res) {
    //     if (err) {
    //       console.log("error in creating channel");
    //     } else {
    //       console.log("channel for DM created successfully");
    //       // console.log('new channel created :', res)
    //       currentChannel = res;
    //       currentChannelDM = currentChannel;
    //       EventService.busy(false);
    //       localStorage.setItem('last_active_channel', JSON.stringify(currentChannel));
    //       $state.go("dashboard.channel-chat-window", {
    //         channelId: res.id,
    //         channel: res
    //       });
    //     }
    //   });
  }

}
