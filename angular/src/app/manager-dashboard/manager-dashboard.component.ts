import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';

  
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule
    
    
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent {  

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

  constructor() {
    const year = 2024;
    const month = 1; // départ 0 Février io
    const numberOfDay = this.getNumberOfDaysInMonth(year,month);

  }

  
  getNumberOfDaysInMonth(year: number, month: number): number {
    const nextMonthDate = new Date(year, month +  1,  0);
    return nextMonthDate.getDate();
  }


//Chart Bar Réservations
  public lineChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',

    ],
  
    datasets: [
      {
        data: [ 45, 50, 60, 70, 75, 65, 50, 60, 55, 50, 45, 45 ],
        label: 'Réservations',
        borderColor: 'black',
        backgroundColor: '#D9B36C'
      }
    ]
  };

  //Chart Bar Bénéfice
  public lineChartData2: ChartConfiguration<'bar'>['data'] = {
    labels: [
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',
      '1',
      '2',
      '3',
      '4',

    ],
  
    datasets: [
      {
        data: [ 45, 50, 60, 70, 75, 65, 50, 60, 55, 50, 45, 45 ],
        label: 'Chiffre d affaire ',
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

  public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    datasets: [
      {
        label : 'Top 3 Services',
        data :  [300, 500, 100],
        backgroundColor : [ '#BFBFBF', '#A68A56', '#D9B36C' ]
      }
    ]

  }
  public pieChartLabels2:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData2: ChartConfiguration<'pie'>['data'] = {
    datasets: [
      {
        label : 'Top 3 Catégories',
        data :  [300, 200, 100],
        backgroundColor : [ '#D9B36C', '#A68A56', '#BFBFBF' ]
      }
    ]

  }

 
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  //Fin Pie
}
