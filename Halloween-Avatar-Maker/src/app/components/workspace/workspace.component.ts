import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { MenuBarComponent } from './menu-bar';
import { LayerBoxComponent } from './layer-box';
import { BottomBarComponent } from './bottom-bar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [BottomBarComponent, LayerBoxComponent, MenuBarComponent, CommonModule],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent {

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }
  isDragging: boolean = false;
  lastMouseX: number = 0;
  lastMouseY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;

  scaleFactor: number = 1;

  downloadImage(fileName: string): void {
    fetch(this.imageUrlToShow)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.png`;
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error descargando la imagen:', error));
  }



  onScroll(event: WheelEvent): void {
    event.preventDefault();
    const zoomSpeed = 0.1;
    if (event.deltaY < 0) {
      this.scaleFactor = Math.min(this.scaleFactor + zoomSpeed, 3);
    } else {
      this.scaleFactor = Math.max(this.scaleFactor - zoomSpeed, 0.5);
    }
  }

  startDragging(event: MouseEvent): void {
    this.isDragging = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    document.body.style.cursor = 'grabbing';
  }

  @HostListener('window:mouseup', ['$event'])
  stopDragging(event: MouseEvent): void {
    this.isDragging = false;
    document.body.style.cursor = 'auto';
  }

  @HostListener('window:mousemove', ['$event'])
  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;

    const dx = event.clientX - this.lastMouseX;
    const dy = event.clientY - this.lastMouseY;
    this.offsetX += dx;
    this.offsetY += dy;

    const content = document.querySelector('.resizable-content') as HTMLElement;
    if (content) {
      content.style.transform = `scale(${this.scaleFactor}) translate(${this.offsetX}px, ${this.offsetY}px)`;
    }

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  incrementar(): void {
    this.scaleFactor = Math.min(this.scaleFactor + 0.1, 3);
    this.updateTransform();
  }

  disminuir(): void {
    this.scaleFactor = Math.max(this.scaleFactor - 0.1, 0.5);
    this.updateTransform();
  }

  updateTransform(): void {
    const content = document.querySelector('.resizable-content') as HTMLElement;
    if (content) {
      content.style.transform = `scale(${this.scaleFactor}) translate(${this.offsetX}px, ${this.offsetY}px)`;
    }
  }

  imagenUrlOriginal: string = 'https://springstorage.blob.core.windows.net/images/image.jpg';
  imageStore: string[] = [];
  imageUrlToShow: string = '';
  imageDimensions: { width: number; height: number } | null = null;
  isLoading: boolean = false;
  loadingTime: number = 0;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.imagenUrlOriginal = params.get('imageUrl') || '';
    });
    this.imageUrlToShow = this.imagenUrlOriginal;
    this.calculateImageDimensions();
  }

  updateImageUrl(editedUrl: string): void {
    this.imageStore.push(editedUrl);
    this.imageUrlToShow = this.imageStore[this.imageStore.length - 1];
    this.calculateImageDimensions();
  }

  restoreOriginalImage(): void {
    this.imageStore = [];
    this.imageUrlToShow = this.imagenUrlOriginal;
  }
  calculateImageDimensions(): void {
    const img = new Image();
    img.src = this.imageUrlToShow;
    img.onload = () => {
      this.imageDimensions = { width: img.width, height: img.height };
    };
  }

  showLoading(seconds: number): void {
    this.isLoading = true;
    this.loadingTime = seconds;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, seconds * 1000);
  }
}