import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../services/employe.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employe-profil',
  standalone: true,
  imports: [],
  templateUrl: './employe-profil.component.html',
  styleUrl: './employe-profil.component.css'
})
export class EmployeProfilComponent implements OnInit {

  constructor(private router: Router, private  employeService: EmployeService){
    
  }
  employe: any;
  heureDebut: any;
  heureFin: any;

  modifPhotoForm = new FormGroup({
    photo: new FormControl<string>(""),
  })

  ngOnInit(): void {
    this.getEmpProfil();
  }

  getEmpProfil(){
    
    this.employeService.getEmploye().subscribe(employe =>{
      this.employe = employe;
      const dateDebut = new Date(this.employe.heure_debut)
      const heure = dateDebut.getHours();
      this.heureDebut = heure;

      const dateFin = new Date(this.employe.heure_fin)
      const heure2 = dateFin.getHours();
      this.heureFin = heure2;
    });

  }

  modifPhoto(){
    
      }
  }


 
  


