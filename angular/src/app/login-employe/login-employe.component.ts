import { Component, signal } from '@angular/core';
import { FrontComponent } from '../front/front.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeService } from '../services/employe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-employe',
  standalone: true,
  imports: [
    FrontComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-employe.component.html',
  styleUrl: './login-employe.component.css'
})
export class LoginEmployeComponent {

    constructor(private router: Router, private employeService: EmployeService){

    }

    ngOnInit(){

    }

    onLogin = signal(true);

    loading = signal(false);

    error = signal(false);

    loginForm = new FormGroup({
      login: new FormControl("sabrina@gmail.com"),
      password: new FormControl("password123")
    });

    login(){
      let { login, password } = this.loginForm.value;
      let loginObject = { "userInfo" : {login: login, password: password}}
      this.employeService.login(loginObject).subscribe({
        next: (data: any) => {
          this.loading.set(true);
          this.onLogin.set(false);
          this.router.navigate(['/employe/calendar'])

        },
        error: (error) =>{
          this.error.set(true);
          this.loading.set(false);
          this.onLogin.set(true);
        }
      })
    }

}
