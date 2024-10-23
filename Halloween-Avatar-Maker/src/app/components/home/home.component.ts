import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Banner1Component } from '@components/banner1';
import { Banner2Component } from '@components/banner2';
import { CarruselComponent } from '@components/carrusel';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CarruselComponent, RouterOutlet, Banner1Component, Banner2Component],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
}
