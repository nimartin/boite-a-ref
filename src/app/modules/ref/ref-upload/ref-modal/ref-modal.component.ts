import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ref-modal',
  standalone: true,
  imports: [],
  templateUrl: './ref-modal.component.html',
  styleUrl: './ref-modal.component.scss'
})
export class RefModalComponent {
  @Input() class : string = '';
}
