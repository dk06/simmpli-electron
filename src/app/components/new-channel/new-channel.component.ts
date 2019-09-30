import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


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

  selectedUsers: any = [];
  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private commonService: CommonService,
    private api: ApiService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.dropdownList = JSON.parse(this.route.snapshot.params['queryParams']);
  }

  ngOnInit() {

    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'full_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onChangeChannelStatus(event) {
    console.log('event', event);
    if (event) {
      this.channel.channel_type = 'private';
    } else {
      this.channel.channel_type = 'public';
    }
  }

  createNewChannel = function () {
    this.selectedUsers.forEach(selectedUser => {
      this.channel.channel_profiles_attributes.push({
        profile_id: selectedUser.id,
        active: true
      });
    });
    this.commonService.loaderShow();
    this.api.createChannel(this.channel).subscribe(res => {
      this.commonService.loaderHide();
      if (res.success) {
        console.log('channel created successfully');

        this.router.navigate(['/home']);
        // this.commonService.callChatData(res.channel.id);

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
