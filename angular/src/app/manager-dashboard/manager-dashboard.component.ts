import { Component, OnInit, signal } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';


import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CommonModule } from '@angular/common';
import { ManagerService } from '../services/manager.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent implements OnInit {

  statReservationData: any[] = [];

  statChiffreAffaireData: any[] = [];

  tempsTravailData: any[] = [];

  monthYearReservationControl = new FormControl(this.getCurrentYearMonth());

  monthYearChiffreAffaireControl = new FormControl(this.getCurrentYearMonth());

  totalReservMonth = 0;

  maxReservMonth = 0;

  totalChiffreAffaireMonth = 0;

  loadingReserv = signal(true);

  loadingCaf = signal(true);

  loadingBenef = signal(false);

  ngOnInit(): void {
    this.managerService.getTempsTravailMoyenByEmploye().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.tempsTravailData = data;
        this.getStatReservation();
        this.getStatChiffreAffaire();
      },
      error: (error) => {

      }
    })
  }


  beneficeData : any = null;

  constructor(private managerService: ManagerService,private fb: FormBuilder) {
    // const year = 2024;
    // const month = 1; // départ 0 Février io
    // const numberOfDay = this.getNumberOfDaysInMonth(year, month);
    this.myForm = this.fb.group({
      items: this.fb.array([]),
      loyer: this.fb.control(0),
      "achat pièces": this.fb.control(0),
    });
  }

  myForm: FormGroup;

  computeProfit(){
    this.loadingBenef.set(true);
    //console.log(this.myForm.value)
    let parameters = this.myForm.value;
    for(let depense of parameters.items){
      parameters[depense.label] = depense.value;
    }
    delete parameters.items;
    this.managerService.getTotalBenefMonth(parameters).subscribe({
      next : (data : any) => {
        this.beneficeData = data;
        this.beneficeData.chargesFields = Object.keys(data.charges);
        this.beneficeData.chargesValues = Object.values(data.charges);
        //console.log(this.beneficeData);
      },
      error : (error) => {
        console.log(error)
      },
      complete : () => {
        this.loadingBenef.set(false);
      }
    })
    //console.log(parameters);
  }

  get items(): FormArray {
    return this.myForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      label: '',
      value: 0
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  getStatReservation() {
    this.loadingReserv.set(true);
    if (!this.monthYearReservationControl.value)
      this.monthYearReservationControl.setValue(this.getCurrentYearMonth())
    const value = this.monthYearReservationControl.value;
    const [year, monthWithZero] = value!.split('-');
    const month = parseInt(monthWithZero, 10).toString();
    this.managerService.countRdvByDayForMonth(month, year).subscribe({
      next: (data: any) => {
        this.statReservationData = data;
        this.maxReservMonth = data.reduce((max : any, item: any) => Math.max(max, item.count), 0);
        this.totalReservMonth = data.reduce((sum: any, item: any) => sum + item.count, 0);

        //console.log(data);
        let label = this.getDaysInMonthArray(parseInt(year, 10), parseInt(month, 10));
        let value = label.map(day => {
          const found = data.find((item: any) => item._id === parseInt(day, 10));
          return found ? found.count : 0;
        });
        //console.log(newArray);
        this.reservationLineChartData = {
          labels:label,
      
          datasets: [
            {
              data: value,
              label: 'Réservations',
              borderColor: 'black',
              backgroundColor: '#D9B36C'
            }
          ]
        };
      },
      error: (error) => {

      },
      complete : () => {
        this.loadingReserv.set(false)
      }
    })
  }


  getStatChiffreAffaire() {
    this.loadingCaf.set(true);
    if (!this.monthYearChiffreAffaireControl.value)
      this.monthYearChiffreAffaireControl.setValue(this.getCurrentYearMonth())
    const value = this.monthYearChiffreAffaireControl.value;
    const [year, monthWithZero] = value!.split('-');
    const month = parseInt(monthWithZero, 10).toString();
    this.managerService.getChiffreAffaireByDayForMonth(month, year).subscribe({
      next: (data: any) => {
        this.statChiffreAffaireData = data;
        this.totalChiffreAffaireMonth = data.reduce((sum: any, item: any) => sum + item.totalPayment, 0);

        //console.log(data);
        let label = this.getDaysInMonthArray(parseInt(year, 10), parseInt(month, 10));
        let value = label.map(day => {
          const found = data.find((item: any) => item._id === parseInt(day, 10));
          return found ? found.totalPayment : 0;
        });
        //console.log(newArray);
        this.cafLineChartData = {
          labels:label,
      
          datasets: [
            {
              data: value,
              label: "Chiffre d'affaire",
              borderColor: 'black',
              backgroundColor: '#D9B36C'
            }
          ]
        };
      },
      error: (error) => {

      },
      complete : () => {
        this.loadingCaf.set(false)
      }
    })
  }

  getNumberOfDaysInMonth(year: number, month: number): number {
    const nextMonthDate = new Date(year, month + 1, 0);
    return nextMonthDate.getDate();
  }

  getDaysInMonthArray(year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  }

  getCurrentYearMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  addExpenseField() {
    const otherExpensesContainer = document.getElementById('otherExpenses');

    if (otherExpensesContainer) {
      const newInput = document.createElement('input');
      newInput.type = 'number';
      newInput.name = 'otherExpenses';
      newInput.min = '0';
      newInput.required = true;
      otherExpensesContainer.appendChild(newInput);
    } else {
      console.error("Error: 'otherExpensesContainer' not found");
    }
  }


  //Chart Bar Réservations
  reservationLineChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      '1',
      '2',
      '3',
      '4',
    ],

    datasets: [
      {
        data: [0,0,0,0],
        label: 'Réservations',
        borderColor: 'black',
        backgroundColor: '#D9B36C'
      }
    ]
  };

  //Chart Bar Bénéfice
  public cafLineChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      '1',
      '2',
      '3',
      '4'
    ],

    datasets: [
      {
        data: [0, 0, 0, 0],
        label: "Chiffre d'affaire",
        borderColor: 'black',
        backgroundColor: '#D9B36C'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'bar'> = {
    responsive: true
  };


  public lineChartOptions2: ChartOptions<'bar'> = {
    responsive: true
  };

  public lineChartLegend = true;

  //Pie Chart

  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    datasets: [
      {
        label: 'Top 3 Services',
        data: [300, 500, 100],
        backgroundColor: ['#BFBFBF', '#A68A56', '#D9B36C']
      }
    ]

  }
  public pieChartLabels2: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData2: ChartConfiguration<'pie'>['data'] = {
    datasets: [
      {
        label: 'Top 3 Catégories',
        data: [300, 200, 100],
        backgroundColor: ['#D9B36C', '#A68A56', '#BFBFBF']
      }
    ]

  }


  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  //Fin Pie
}
