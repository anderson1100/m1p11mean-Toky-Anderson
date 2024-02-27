import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private http: HttpClient) { }

  baseUrl: string = "http://localhost:3000/";

  login(loginObject: object) {

    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    //console.log("login");

    return this.http.post('manager/login', loginObject, options)
  }

  logout(){
    return this.http.get('/logout');
  }
}
