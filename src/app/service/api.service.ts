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
  // baseUrl: any = 'http://simmpli.com';

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
    return this.http.get(this.baseUrl + "/chat/channels", { headers: this.getHeader() }).map(res => res.json());
  }

  sendFile(channelId, message, files: any) {

    let data: any = {
      message: {
        body: message,
        message_attachments_attributes: []
      },
    }

    // data.message.message_attachments_attributes = files;
    // let formData = new FormData();

    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        data.message.message_attachments_attributes.push({ attachment: files[i] });
      }
    }


    return this.http.post(this.baseUrl + `/chat/channels/${channelId}/messages`, data, { headers: this.getHeader() }).map(res => res.json());

    // if (files && files.length) {
    //   files.forEach(file => {
    //     if (!file.$error) {
    //       Upload.upload({
    //         url: `${this.baseUrl}/chat/channels/${channelId}/messages`,
    //         data: {
    //           message: {
    //             body: message,
    //             message_attachments_attributes: [{
    //               attachment: file
    //             }]
    //           },
    //         },
    //         method: 'POST',
    //         headers: { headers: this.getHeader() }
    //       }).then((res) => {
    //         console.log('inside response');
    //         console.log(res);
    //         callback(undefined, res);
    //       }).catch((err) => {
    //         console.log('error uploading files');
    //         console.log(err);
    //         callback(err, undefined);
    //       })
    //     }
    //   });
    // }

  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/chat/channels/profiles`, { headers: this.getHeader() }).map(res => res.json());
  }

  getMessages(channelId, pageNo) {
    return this.http.get(`${this.baseUrl}/chat/channels/${channelId}/messages?page=${pageNo}`, { headers: this.getHeader() }).map(res => res.json());
  }

  markAsReceived = (channelId, messageId) => {
    return this.http.put(`${this.baseUrl}/chat/channels/${channelId}/messages/${messageId}/mark_as_received`, {}, { headers: this.getHeader() }).map(res => res.json());

  }

  markAsRead = (channelId) => {
    return this.http.put(`${this.baseUrl}/chat/channels/${channelId}/messages/mark_as_read`, {}, { headers: this.getHeader() }).map(res => res.json());
  }

  createChannel = (channel) => {
    return this.http.post(`${this.baseUrl}/chat/channels`, { channel: channel }, { headers: this.getHeader() }).map(res => res.json());
  }

  sendMessage = (channelId, message, mentions) => {
    return this.http.post(`${this.baseUrl}/chat/channels/${channelId}/messages`, { message: { body: message, message_profiles_attributes: mentions } }, { headers: this.getHeader() }).map(res => res.json());
  }
}
