import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from '../main/service/app-service.service'

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})

export class FirstLoginComponent implements OnInit {
  firstLoginForm: FormGroup;
  loading = false;
  submitted = false;
  password: any;
  newPassword: any;
  confirmNewPassword: any;
  nullNewPassword: boolean = false;
  nullConfirmNewPassword: boolean = false;
  invalidPassword: boolean = false;
  isChecked: boolean = false;
  list = [];
  userId: any;
  userName: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private as: AppService
  ) { }

  ngOnInit(): void {
    this.as.list$.subscribe(list => (this.list = list));
    if (this.list.length > 0) {
      this.userId = this.list[0].userId;
      this.userName = this.list[0].username;
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {

    if (this.newPassword == null) {
      this.nullNewPassword = true;
    } else {
      this.nullNewPassword = false;
    }

    if (this.confirmNewPassword == null) {
      this.nullConfirmNewPassword = true;
    } else {
      this.nullConfirmNewPassword = false;
    }

    if (this.confirmNewPassword != this.newPassword) {
      this.invalidPassword = true;
    } else {
      this.invalidPassword = false;
    }

    if (this.invalidPassword == false && this.nullNewPassword == false && this.nullConfirmNewPassword == false && this.isChecked == true) {
      this.authService.firstLogin(this.userId, this.userName, this.newPassword)
        .subscribe(
          data => {
            this.router.navigate(['/login']);
          },
          error => {
            this.loading = false;
          });
    }

  }

}
