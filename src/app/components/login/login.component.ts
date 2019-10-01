import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/api.service';
import { ValidationService } from 'src/app/service/validation.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm: any;

  constructor(
    private route: Router,
    private commonService: CommonService,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, ValidationService.emailValidator]]
    });
  }

  ngOnInit() {
    this.commonService.loaderHide();
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      this.route.navigate(['/chat-room']);
      this.commonService.setCurrentUser(user);
    } else {
      this.route.navigate(['/login']);
    }
  }

  login() {
    if (!this.userForm.value.email && !this.userForm.value.email) {
      return;
    }
    this.api.login(this.userForm.value).subscribe(async (response: any) => {
      if (response.success) {
        response.user.online = false;
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('auth_token', response.authorization.token);
        // this.commonService.notify('success', 'Success', 'Login successfully..');
        this.commonService.showSuccess(response.message);
        await this.commonService.setCurrentUser(response.user);
        await this.route.navigate(['/chat-room']);
      } else {
        this.commonService.showWarning(response.message);

        console.log('not login');
      }
    }, error => {
      console.log('error', error);
    });

  }

}
