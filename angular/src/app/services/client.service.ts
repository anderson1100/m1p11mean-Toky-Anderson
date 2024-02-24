import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  baseUrl : string = "http://localhost:3000/";

  pageToShow(actualPage : number, nombrePage : number){
    let rep: [number, number[], number] = [0, [], 0];
    rep[0] = (actualPage === 1) ? 0 : 1;
    let first = (actualPage < 3) ? 1 : Math.min(actualPage-actualPage % 3,nombrePage);
    let last = Math.min(2+(first),nombrePage);
    rep[1] = [];
    for(let i = first ; i<=last; i++){
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

  login(loginObject : object){
    
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post('client/login', loginObject, options)
  }

  addToServicesFav(id_service : string){
    ///////////////////////////
    let headers = new HttpHeaders({
      'content-Type': 'application/json',
    })

    let options = {
      headers: headers,
    };

    return this.http.post(`client/services_fav/${id_service}`,{}, options)
  }

  removeFromServicesFav(id_service : string){
    return this.http.delete(`client/services_fav/${id_service}`)
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

  getListServiceByCategorie(idCategorie : string, page: string){
    return this.http.get(`client/services_by_categorie/${idCategorie}?page=${page}&limit=3`)
  }

  countPagesByCategorie(id : string){
    return this.http.get(`client/count_pages_categorie/${id}?limit=3`);
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

  getTotalPriceBasket(){
    return this.http.get('client/basket_total_price');
  }

  getTotalDureeBasket(){
    return this.http.get('client/total_duree_basket');
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
