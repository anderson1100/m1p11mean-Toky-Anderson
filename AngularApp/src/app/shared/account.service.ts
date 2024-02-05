import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Account } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  selectedAccount : Account;
  accounts : Account[];

  constructor() { }
}
