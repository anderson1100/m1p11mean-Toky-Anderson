import { Component, Input, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-crudemploye',
  standalone: true,
  imports: [],
  templateUrl: './crudemploye.component.html',
  styleUrl: './crudemploye.component.css'
})
export class CrudemployeComponent {
  @Input() additionalCt: any;
  constructor(private viewRef: ViewContainerRef) {}

  ngOnInit() {
    this.viewRef.clear();
    this.viewRef.createComponent(this.additionalCt.childComponent);
  }
}
