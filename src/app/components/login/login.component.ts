import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/api.service';
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

  constructor(
    private route: Router,
    private commonService: CommonService,
    private api: ApiService
  ) { }

  ngOnInit() {

  }

  login() {
    this.api.login(this.user).subscribe((response) => {
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('auth_token', response.authorization.token);
        this.commonService.setCurrentUser();
        this.route.navigate(['/chat-room']);
      } else {
        console.log('not login');
      }
    }, error => {
      console.log('error', error);
    });

  }

}
