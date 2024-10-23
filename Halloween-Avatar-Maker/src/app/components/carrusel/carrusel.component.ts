import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarruselComponent {
  constructor(private cdr : ChangeDetectorRef){}
    images: string[] = [
      'https://springstorage.blob.core.windows.net/pagehome/1I.webp',
      'https://springstorage.blob.core.windows.net/pagehome/Carrusel2.webp',
      'https://springstorage.blob.core.windows.net/pagehome/Carrusel3.webp',
      'https://springstorage.blob.core.windows.net/pagehome/Carrusel4.webp',
      'https://springstorage.blob.core.windows.net/pagehome/Carrusel5.webp',
      'https://springstorage.blob.core.windows.net/pagehome/Carrusel6.webp',
      'https://springstorage.blob.core.windows.net/pagehome/Carrusel7.webp',
      'https://springstorage.blob.core.windows.net/pagehome/Carrusel8.webp'
    ];
    currentImageIndex: number = 0;
    currentImage: string = this.images[this.currentImageIndex];
  
    ngOnInit() {
      this.startSlider();
    }
  
    startSlider() {
      setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.cdr.detectChanges();
      }, 2000);
    }
}
