import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-banner1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner1.component.html',
  styleUrl: './banner1.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class Banner1Component {

}
