import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isFound = false;
  message: string;
  email = '';

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notiService: NotificationsService) { // redirect to home if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      username: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.f.username.value).subscribe(
      data => {
        this.isFound = false;
        if (data.status === 404) {
          this.isFound = true;
          this.message = data.message;
        }
        if (data.status === 400) {
          this.notiService.error('เกิดข้อผิดพลาด', data);
        }
        if(data.status === 200) {
          this.notiService.success('ส่งข้อมูลสำเร็จ', 'ส่งข้อมูลสำหรับรีเซ็ตรหัสผ่านสำเร็จ');
        }
        this.loading = false;
      },
      error => {
        this.notiService.error('เกิดข้อผิดพลาด', error.error);
        this.loading = false;
      });
  }

  change() {
    this.isFound = false;
  }
}
