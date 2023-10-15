import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { mainModule } from 'process';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { ForgetPasswordComponent } from './modules/forget-password/forget-password.component';
import { LoginComponent } from './modules/login/login.component';
import { MainComponent } from './modules/main/main.component';
import { FirstLoginComponent } from "./modules/first-login/first-login.component";


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ForgetPasswordComponent },
  { path: 'first-login' , component: FirstLoginComponent},
  {
    path: '', component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
