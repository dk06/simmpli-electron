import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  indexNo: string = "";
  headers: any;

  // baseUrl: String = 'http://192.168.1.34:3002';

  baseUrl: any = 'http://localhost:3000';

  constructor(private http: Http) {
    console.log("connected Login");
    localStorage.setItem('urlBase', this.baseUrl);
    this.baseUrl += '/api/v1';

  }

  getHeader() {
    var token = 'Bearer ' + ((localStorage.getItem('auth_token')));
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token
    });

    return this.headers;
  }


  login(user) {
    return this.http.post(this.baseUrl + '/users/sign_in', user).map(res => res.json());
  }

  logOut = function (key) {
    return this.http.delete(this.baseUrl + '/sessions/' + key);
  }

  getChannels = () => {

    this.http.get(this.baseUrl + "/chat/channels", { headers: this.getHeader() }).map(res => res.json());
    // .then((res) => {
    //   callback(undefined, res.data.channels);
    // })
    // .catch(err => {
    //   console.log("====================================");
    //   console.log(`error: ${JSON.stringify(err)}`);
    //   console.log("====================================");
    //   callback(err, undefined);
    // });
  }

  sendFile = (channel, message, files, callback) => {

    if (files && files.length) {
      files.forEach(file => {
        if (!file.$error) {
          // Upload.upload({
          //   url: `${this.baseUrl}/chat/channels/${channel.id}/messages`,
          //   data: {
          //     message: {
          //       body: message,
          //       message_attachments_attributes: [{
          //         attachment: file
          //       }]
          //     },
          //   },
          //   method: 'POST',
          //   headers: header
          // }).then((res) => {
          //   console.log('inside response');
          //   console.log(res);
          //   channel.channel_profiles.forEach(profile => {
          //     console.log(`pushing on: new-message-${profile.profile_id}`)
          //     // W3socketService.push(`simmpli-chat`, `new-message-${profile.profile_id}`, res.data.message);
          //   });
          //   callback(undefined, res);
          // }).catch((err) => {
          //   console.log('error uploading files');
          //   console.log(err);
          //   callback(err, undefined);
          // })
        }
      });
    }

  }

  getUsers() {

    return this.http.get(`${this.baseUrl}/chat/channels/profiles`, { headers: this.getHeader() }).map(res => res.json());
    //   callback(undefined, res.data.profiles);
    // })
    //   .catch(err => {
    //     console.log('====================================');
    //     console.log(JSON.stringify(err));
    //     console.log('====================================');
    //     callback(err, undefined);
    //   })
  }

  getMessages = (channelId, pageNo = 1, callback) => {

    this.http.get(`${this.baseUrl}/chat/channels/${channelId}/messages?page=${pageNo}`, { headers: this.getHeader() }).map(res => res.json());
    //   callback(undefined, res.data.messages);
    // })
    //   .catch(err => {
    //     console.log('====================================');
    //     console.log(JSON.stringify(err));
    //     console.log('====================================');
    //     callback(err, undefined);
    //   });
  }

  markAsReceived = (channelId, messageId, callback) => {

    this.http.put(`${this.baseUrl}/chat/channels/${channelId}/messages/${messageId}/mark_as_received`, {}, { headers: this.getHeader() }).map(res => res.json());
    //   console.log('marked as received');
    //   callback(res);
    // })
  }

  markAsRead = (channelId, callback) => {
    this.http.put(`${this.baseUrl}/chat/channels/${channelId}/messages/mark_as_read`, {}, { headers: this.getHeader() }).map(res => res.json());
    //   console.log('marked as read');
    //   callback(res);
    // })
  }

  createChannel = (channel, callback) => {

    this.http.post(`${this.baseUrl}/chat/channelsthis.`, { channel: channel }, this.headers()).map(res => res.json());
    //   console.log(res);
    //   res.data.channel.channel_profiles.forEach(profile => {
    //     console.log(`pushing on: new-message-${profile.profile_id}`)
    //     // W3socketService.push(`simmpli-chat`, `new-channel-${profile.profile_id}`, {
    //     //   message: "You got added to a new channel",
    //     //   channel: res.data.channel
    //     // });
    //   });
    //   callback(undefined, res.data.channel);
    // })
    // .catch(err => {
    //   console.log('error in creating channel');
    //   callback(err, undefined);
    // });
  }

  sendMessage = (channel, message, mentions, callback) => {

    this.http.post(`${this.baseUrl}/chat/channels/${channel.id}/messagesthis.`, { message: { body: message, message_profiles_attributes: mentions } }, { headers: this.getHeader() }).map(res => res.json());
    //   console.log(res.data.message)
    //   channel.channel_profiles.forEach(profile => {
    //     console.log(`pushing on: new-message-${profile.profile_id}`)
    //     // W3socketService.push(`simmpli-chat`, `new-message-${profile.profile_id}`, res.data.message);
    //   });
    //   callback(undefined, res.data.message);
    // })
    // .catch(err => {
    //   console.log(JSON.stringify(err));
    //   callback(err, undefined);
    // });
  }
}
