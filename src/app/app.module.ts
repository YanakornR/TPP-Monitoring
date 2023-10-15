import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { ForgetPasswordComponent } from './modules/forget-password/forget-password.component';
import { MainComponent } from './modules/main/main.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './helper/AuthInterceptor';
import { UrlSerializer } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LowerCaseUrlSerializer } from './helper/LowerCaseUrlSerializer';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { AgmCoreModule } from '@agm/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FirstLoginComponent } from './modules/first-login/first-login.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetPasswordComponent,
    MainComponent,
    FirstLoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    SharedModule,
    HttpClientModule,
    NgxScrollTopModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCNaXFqssHS_GnpCwKfNdAPmSmO1j8s2PY'
    }),
    SimpleNotificationsModule.forRoot({
      position: ['bottom', 'right'],
      preventDuplicates: true,
      pauseOnHover: true,
      timeOut: 3000
    }),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS
      , useClass: AuthInterceptor
      , multi: true
    }, {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
