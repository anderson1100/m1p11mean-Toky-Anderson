import { Component, Input, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-crudservices',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './crudservices.component.html',
  styleUrl: './crudservices.component.css'
})
export class CrudservicesComponent {
  @Input() additionalCt: any;
  constructor(private viewRef: ViewContainerRef) {}

  ngOnInit() {
    this.viewRef.clear();
    this.viewRef.createComponent(this.additionalCt.childComponent);
  }
}
