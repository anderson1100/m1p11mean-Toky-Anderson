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

  countRdvByDayForMonth(month: string, year: string) {
    return this.http.get(`manager/count_rdv_by_day_for_month?month=${month}&year=${year}`)
  }

  getChiffreAffaireByDayForMonth(month: string, year: string) {
    return this.http.get(`manager/chiffre_affaire_by_day_for_month?month=${month}&year=${year}`)
  }

  getTotalBenefMonth(data : object){
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('manager/total_benef_month', data, options);
  }

  logout() {
    return this.http.get('logout');
  }

  //crud employes

  getEmployes(){
    return this.http.get('manager/employes');
  }

  addEmploye(formData : FormData){
    return this.http.post(`manager/employes`,formData);
  }

  updateEmploye(id : string,formData : FormData){
    return this.http.put(`manager/employes/${id}`,formData);
  }

  deleteEmploye(id : string){
    return this.http.delete(`manager/employes/${id}`);
  }

  //crud services


  getServices(){
    return this.http.get('manager/services');
  }

  getCategories(){
    return this.http.get('manager/categories');
  }

  addService(formData : FormData){
    return this.http.post(`manager/services`,formData);
  }

  updateService(id : string,formData : FormData){
    return this.http.put(`manager/services/${id}`,formData);
  }

  deleteService(id : string){
    return this.http.delete(`manager/services/${id}`);
  }



  //crud offre speciales

  getOffres(){
    return this.http.get('manager/offres');
  }

  addOffre(formData : object){
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };
    return this.http.post(`manager/offres`,formData,options);
  }

  updateOffre(id : string,formData : object){
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };
    return this.http.put(`manager/offres/${id}`,formData,options);
  }

  deleteOffre(id : string){
    return this.http.delete(`manager/offres/${id}`);
  }
}
