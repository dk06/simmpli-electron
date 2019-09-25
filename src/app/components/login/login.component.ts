import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any = {
    email: '',
    password: ''
  };

  constructor(private route: Router, private commonService: CommonService) { }

  ngOnInit() {
  }

  login() {
    this.commonService.setCurrentUser();
    this.route.navigate(['/chat-room']);
  }

}
