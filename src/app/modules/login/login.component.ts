import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from '../main/service/app-service.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    loginData: any = [];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private as: AppService
    ) {
        // redirect to home if already logged in
        if (this.authService.isAuthenticated) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(this.f.username.value, this.f.password.value)
            .subscribe(
                data => {
                    console.log("data ==",data)
                    this.loginData = {
                        username: this.f.username.value,
                        password: this.f.password.value,
                        userId: data.user.id
                    }
                    this.as.addNewList(this.loginData);

                    if (data.status == 'firstLogin') {
                        this.router.navigate(['/first-login']);
                    } else {
                        this.router.navigate(['/home']);
                    }

                },
                error => {
                    this.loading = false;
                });


    }
}
