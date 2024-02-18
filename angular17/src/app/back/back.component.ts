import { ViewContainerRef, ViewChild, Component } from '@angular/core';
import { Tab } from './tab';
import { TabComponent } from './const';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { GestionemployeComponent } from '../gestionemploye/gestionemploye.component';
import { GestionserviceComponent } from '../gestionservice/gestionservice.component';


@Component({
  selector: 'app-back',
  standalone: true,
  imports: [  MatTabsModule, CommonModule],
  templateUrl: './back.component.html',
  styleUrl: './back.component.css'
})
export class BackComponent {
    selectedIndex = 0;
    tabVal : Tab[] = [
      {
        title : 'Dashboard',
        component : TabComponent.TabDashboard,
        additionalCt : {
          bodyTitle : 'Titre',
        }
      },
      {
        title : 'Gestion des Services',
        component : TabComponent.TabServices,
        additionalCt : {
          bodyTitle : 'Titre',
          childComponent : GestionserviceComponent,
        },
      },
      {
        title : 'Gestion des Employés',
        component : TabComponent.TabEmploye,
        additionalCt : {
          bodyTitle : 'Titre',
          childComponent : GestionemployeComponent,
        },
      },
    
    ];

    constructor(private viewRef : ViewContainerRef){}

    ngOnInit(){
      if (this.tabVal?.length > 0){
        this.loadComponent(this.tabVal[this.selectedIndex]);
      }

    }

    ngOnChanges(){
      
    }

    onClick(event: any) {
      console.log('event => ', event);
      this.loadComponent(this.tabVal[event.index]);
    }

    loadComponent(tabVal : Tab){
      this.viewRef.clear();
      const compRef = this.viewRef.createComponent(tabVal.component);
      if(compRef){
        (<any>compRef.instance).additionalCt = tabVal.additionalCt;

      }
    }
 

  
}
