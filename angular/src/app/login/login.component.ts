import { Component, OnInit, signal } from '@angular/core';
import { FrontComponent } from '../front/front.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FrontComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})



export class LoginComponent implements OnInit {

  constructor(private router: Router, private clientService: ClientService) {
  }

  ngOnInit() {

  }

  loading = signal(false);

  error = signal(false);

  errorSignup = signal(false);

  defaultErrorMessage = "Une erreur s'est produite. Veuillez réessayer";

  errorMessage = signal("");

  loginForm = new FormGroup({
    login: new FormControl("goat@gmail.com"),
    password: new FormControl("password123")
  });

  signupForm = new FormGroup({
    nom: new FormControl("test"),
    prenom: new FormControl("test"),
    email: new FormControl("anderson@gmail.com", [Validators.required, Validators.email]),
    username: new FormControl("test"),
    password: new FormControl("password123", [Validators.required, Validators.minLength(8)]),
    password2: new FormControl("password123", [Validators.required, Validators.minLength(8)])
  });

  login() {
    this.error.set(false);
    this.loading.set(true);
    let { login, password } = this.loginForm.value
    let loginObject = { "userInfo" : { login: login, password: password } }
    //console.log(loginObject);
    this.clientService.login(loginObject).subscribe({
      next: (data: any) => {
        console.log(data);
        this.loading.set(false);
        this.router.navigate(['/services'])
      },
      error: (error) => {
        //console.log("there is an error")
        this.error.set(true);
        this.loading.set(false);
      }
    })
  }

  signup() {
    this.errorSignup.set(false);
    this.loading.set(true);
    if (this.signupForm.value.password !== this.signupForm.value.password2) {
      this.loading.set(false);
      this.errorMessage.set("Les deux champs de mot de passe ne correspondent pas");
      return this.errorSignup.set(true);
    }
    let { nom, prenom, email, username, password } = this.signupForm.value;
    let signupObject = { userInfo: { nom: nom, prenom: prenom, email: email, username: username, password: password } }
    console.log(signupObject)
    this.clientService.signup(signupObject).subscribe({
      next: (data: any) => {
        this.loading.set(false);
        this.errorSignup.set(false);
        this.router.navigate(['/'])
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(this.defaultErrorMessage)
        if (error.status == 409) this.errorMessage.set("Nom d'utilisateur/email déjà utilisé")
        if (error.status == 422) this.errorMessage.set("Vos données ne sont pas valides. Veuillez réesayer")
        this.errorSignup.set(true);
      }
    })
  }



}
