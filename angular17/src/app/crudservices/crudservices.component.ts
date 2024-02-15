import { Component, Input } from '@angular/core';
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
  constructor() {}

  ngOnInit() {}
}
