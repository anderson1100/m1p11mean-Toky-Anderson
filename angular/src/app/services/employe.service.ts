import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  constructor(private http: HttpClient) { }

  baseUrl : string = "http://localhost:3000/employe";



  login(loginObject : object){
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })
    let options = {
      headers: headers,
    };
    return this.http.post('employe/login', loginObject, options)
  }

  getEmploye(): Observable<any>{
    return this.http.get('employe/profil');
  }

  gerHistoryRdv(): Observable<any>{
    return this.http.get('employe/rdv_history');
  }

  getCommission(): Observable<any>{
    return this.http.get('employe/total_commission_today');
  }

  getListRdv(): Observable<any>{
    return this.http.get('employe/list_rdv_today');
  }

}
