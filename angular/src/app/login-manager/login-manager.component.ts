import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-manager',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login-manager.component.html',
  styleUrl: './login-manager.component.css'
})
export class LoginManagerComponent implements OnInit {

  constructor(private router: Router, private managerService: ManagerService) {
  }

  ngOnInit() {

  }

  loading = signal(false);

  error = signal(false);


  defaultErrorMessage = "Une erreur s'est produite. Veuillez réessayer";

  errorMessage = signal("");

  loginForm = new FormGroup({
    login: new FormControl("pata"),
    password: new FormControl("password123")
  });

  login() {
    this.error.set(false);
    this.loading.set(true);
    let { login, password } = this.loginForm.value
    let loginObject = { "userInfo" : { login: login, password: password } }
    //console.log(loginObject);
    this.managerService.login(loginObject).subscribe({
      next: (data: any) => {
        console.log(data);
        this.loading.set(false);
        this.router.navigate(['/manager/dashboard'])
      },
      error: (error) => {
        //console.log("there is an error")
        this.error.set(true);
        this.loading.set(false);
      }
    })
  }
}
