import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  baseUrl: string = "http://localhost:3000/";

  
  payment(payObject : object) {
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('client/payment', payObject, options)
  }
  
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${year}-${this.pad(month)}-${this.pad(day)}T${this.pad(hours)}:${this.pad(minutes)}`;
  }

  pageToShow(actualPage: number, nombrePage: number) {
    let rep: [number, number[], number] = [0, [], 0];
    rep[0] = (actualPage === 1) ? 0 : 1;
    let first = (actualPage < 3) ? 1 : Math.min(actualPage - actualPage % 3, nombrePage);
    let last = Math.min(2 + (first), nombrePage);
    rep[1] = [];
    for (let i = first; i <= last; i++) {
      rep[1].push(i);
    }
    rep[2] = (actualPage === nombrePage) ? 0 : 1;
    return rep;
  }

  //   getTotalPages = (number : number) =>{
  //     let total = 0;
  //     let perPage = 4;
  //     let rapport = number/perPage;
  //     let entier = Math.trunc(rapport);
  //     total = rapport%entier === 0 ? entier : entier + 1;
  //     //Math.ceil
  //     return total; 
  // }

  login(loginObject: object) {

    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    //console.log("login");

    return this.http.post('client/login', loginObject, options)
  }

  logout(){
    return this.http.get('/logout');
  }

  addToServicesFav(id_service: string) {
    ///////////////////////////
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post(`client/services_fav/${id_service}`, {}, options)
  }

  removeFromServicesFav(id_service: string) {
    return this.http.delete(`client/services_fav/${id_service}`)
  }

  addToEmployesFav(id: string) {
    ///////////////////////////
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post(`client/employes_fav/${id}`, {}, options)
  }

  removeFromEmployesFav(id: string) {
    return this.http.delete(`client/employes_fav/${id}`)
  }

  signup(signupObject: object) {
    //console.log(signupObject)

    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('client/signup', signupObject, options)
  }

  getListCategorie() {
    return this.http.get('client/categories');
  }

  getListOffreSpeciale() {
    return this.http.get('client/current_list_offre_speciale');
  }

  getListRdv(/*page: string*/) {
    //?page=${page}&limit=5
    return this.http.get(`client/history_rdv`)
  }

  countPagesRdv() {
    return this.  http.get(`client/count_pages_rdv?limit=5`);
  }

  getListServiceFav() {
    return this.http.get('client/services_fav');
  }

  getListEmployeFav() {
    return this.http.get('client/employes_fav');
  }

  simpleSearch(search : string, page : string) {
    return this.http.get(`client/service_simple_search?search=${search}&page=${page}`);
  }

  countPagesSimpleSearch(search : string){
    return this.http.get(`client/count_pages_simple_search?search=${search}`);
  }

  // countPageNumber(number : number, perPage : number){
  //   return Math.ceil(number / perPage);
  // }

  // countPagesSimpleSearch(search : string) {
  //   return this.  http.get(`client/count_pages_rdv?limit=5`);
  // }

  getListServiceByCategorie(idCategorie: string, page: string) {
    return this.http.get(`client/services_by_categorie/${idCategorie}?page=${page}&limit=3`)
  }

  countPagesByCategorie(id: string) {
    return this.http.get(`client/count_pages_categorie/${id}?limit=3`);
  }

  getService(id: string) {
    return this.http.get(`client/services/${id}`)
  }

  // serviceSimpleSearch(search: string) {
  //   return this.http.get(`client/service_simple_search?search=${search}`)
  // }

  getListEmploye() {
    return this.http.get('client/employes');
  }

  getBasket() {
    return this.http.get('client/my_basket');
  }

  getTotalPriceBasket() {
    return this.http.get('client/basket_total_price');
  }

  getTotalDureeBasket() {
    return this.http.get('client/total_duree_basket');
  }

  addToBasket(id: string) {
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };
    return this.http.post(`client/my_basket/${id}`, options);
  }

  removeFromBasket(id: string) {
    return this.http.delete(`client/my_basket/${id}`);
  }

  takeRdv(data: object) {
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('client/appointment', data,options);
  }
}
