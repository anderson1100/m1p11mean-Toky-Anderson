import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiEmployes = 'http://localhost:3000/api/client/employes';
  private apiServices = 'http://localhost:3000/api/client/services';
  private apiCategories = 'http://localhost:3000/api/client/categories';


  
  constructor(private http: HttpClient){}

  getEmployes(): Observable<any> {
    return this.http.get<any>(this.apiEmployes);
  }

  getServices(): Observable<any> {
    return this.http.get<any>(this.apiServices);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiCategories);
  }



}
