import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  baseUrl : string = "http://localhost:3000/"

  pageToShow(actualPage : number, nombrePage : number){
    let rep = [];
    rep[0] = (actualPage === 1) ? 0 : 1;
    rep[1] = (actualPage < 3) ? 1 : Math.min(actualPage-actualPage % 3,nombrePage);
    rep[2] = Math.min(2+(rep[1]),nombrePage);
    rep[3] = (actualPage === nombrePage) ? 0 : 1;
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

  login(loginObject : object){
    
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('client/login', loginObject, options)
  }

  signup(signupObject : object){
    //console.log(signupObject)

    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('client/signup', signupObject, options)
  } 

  getListCategorie(){
    return this.http.get('client/categories');
  }

  getListServiceByCategorie(idCategorie : string){
    return this.http.get(`client/services_by_categorie/${idCategorie}`)
  }

  getService(id : string){
    return this.http.get(`client/services/${id}`)
  }

  serviceSimpleSearch(search : string){
    return this.http.get(`client/service_simple_search?search=${search}`)
  }

  getListEmploye(){
    return this.http.get('client/employes');
  }

  getBasket(){
    return this.http.get('client/my_basket');
  }

  addToBasket(id : string){
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };
    return this.http.post(`client/my_basket/${id}`,options);
  }

  removeFromBasket(id : string){
    return this.http.delete(`client/my_basket/${id}`);
  }

  takeRdv(data : object){
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('client/appointment',options);
  }
}
