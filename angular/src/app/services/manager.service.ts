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

  getTempsTravailMoyenByEmploye() {
    return this.http.get(`manager/temps_travail_moyen_by_employe`)
  }

  countRdvByDayForMonth(month: number, year: number) {
    return this.http.get(`manager/temps_travail_moyen_by_employe?month=${month}&year=${year}`)
  }

  countChiffreAffaireByDayForMonth(month: number, year: number) {
    return this.http.get(`manager//temps_travail_moyen_by_employe?month=${month}&year=${year}`)
  }

  logout() {
    return this.http.get('/logout');
  }
}
