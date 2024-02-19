import { Component, Injectable, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-front-service',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './front-service.component.html',
  styleUrl: './front-service.component.css'
})
export class FrontServiceComponent implements OnInit{
  categories!: any[];
  isConnected : boolean = true;

  constructor(private service: ServiceService){}

  // ngOnInit(): void {
  //     this.service.getCategories().subscribe(data =>{
  //       this.categories = data;
  //     })
  // }

  ngOnInit(): void {
    
  }
}
