import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-new-channel',
  templateUrl: './new-channel.component.html',
  styleUrls: ['./new-channel.component.scss']
})
export class NewChannelComponent implements OnInit {

  myvalue = false;
  filteredUsers: any;
  switch: any;
  channel = {
    conversation_type: "channel",
    channel_type: "public",
    name: "",
    purpose: "",
    channel_profiles_attributes: []
  };

  // toggle = function () {
  //   !toggle.switch == toggle.switch;
  //   console.log("9999999999999999")
  // };

  myVar = function () {
    console.log("888888888888888888");
    this.myvalue = true
  }

  selectedUsers: any = [];
  newChannel = {
    conversation_type: "channel",
    channel_type: "public",
    name: "",
    purpose: "",
    channel_profiles_attributes: []
  };

  constructor(
    private commonService: CommonService,
    private api: ApiService,
    private route: Router
  ) { }

  ngOnInit() {
  }


  onChangeChannelStatus(event) {
    console.log('event', event);
  }
  toggle() {
    !this.switch == this.switch;
    var x = document.getElementById("myDIV1");
    var z = document.getElementById("myDIV2");
    var y = document.getElementById("text");

    if (x.innerHTML === "Public" && z.innerHTML === " ") {
      x.innerHTML = " ";
      z.innerHTML = "Private"
      y.innerHTML = "This channel can only be joined and viewed by invite"
    } else {
      x.innerHTML = "Public";
      z.innerHTML = " "
      y.innerHTML = "Anyone your workspace can view and join this channel"
    }
  }

  createNewChannel = function () {
    this.selectedUsers.forEach(selectedUser => {
      this.newChannel.channel_profiles_attributes.push({
        profile_id: selectedUser.id,
        active: true
      });
    });
    this.commonService.loaderShow();
    this.api.createChannel(this.newChannel).subscribe(res => {
      this.commonService.loaderHide();
      if (res.success) {
        console.log('channel created successfully');

        this.commonService.callChatData(res.channel.id);

        // $state.go('dashboard.channel-chat-window', {
        //   channelId: res.id,
        //   channel: res
        // });
      } else {
        console.log('error in creating channel');
      }
    }, error => {
      console.log('error', error);
    })
  };

}
