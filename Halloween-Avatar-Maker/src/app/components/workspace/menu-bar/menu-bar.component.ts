import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { WorkspaceComponent } from '../workspace.component';
import { ProdiaService } from 'src/app/service/prodia.service';
import { RequestGenerate, Response1 } from 'src/app/models/prodia.model';
import { catchError, interval, of, switchMap } from 'rxjs';
@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [WorkspaceComponent],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuBarComponent {
  @Input() imagenUrlOriginal!: string;
  @Output() imageUpdated = new EventEmitter<string>();

  constructor(private prodiaService: ProdiaService, @Inject(WorkspaceComponent) private parent: WorkspaceComponent) { }

  getImageDimensions(imageUrl: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = (err) => {
        reject(`Error al cargar la imagen: ${err}`);
      };
    });
  }

  resizeImage(width: number, height: number, maxDimension: number, minDimension: number): { width: number, height: number } {
    // Verifica si las dimensiones están fuera de los límites permitidos
    if (width < minDimension || height < minDimension) {
      const aspectRatio = width / height;
  
      if (width < height) {
        width = minDimension;
        height = Math.round(minDimension / aspectRatio);
      } else {
        height = minDimension;
        width = Math.round(minDimension * aspectRatio);
      }
    } else if (width > maxDimension || height > maxDimension) {
      const aspectRatio = width / height;
  
      if (width > height) {
        width = maxDimension;
        height = Math.round(maxDimension / aspectRatio);
      } else {
        height = maxDimension;
        width = Math.round(maxDimension * aspectRatio);
      }
    }
  
    return { width, height };
  }
  

  applyEffect(effect: string) {
    this.parent.showLoading(20);
    this.getImageDimensions(this.imagenUrlOriginal).then(dimensions => {
      const originalWidth = dimensions.width;
      const originalHeight = dimensions.height;
      const maxDimension = 1024;
      const minDimension = 624;
      const resizedDimensions = this.resizeImage(originalWidth, originalHeight, maxDimension,minDimension);
      const request: RequestGenerate = {
        imageUrl: this.imagenUrlOriginal,
        effect: effect,
        width: resizedDimensions.width,
        height: resizedDimensions.height
      };

      this.prodiaService.generateImageSDXL(request).subscribe(
        (response: Response1) => {
          if (response.status === 'queued') {
            this.checkJobStatus(response.job);
          }
        },
        (error) => {
          console.error('Error en la generación de la imagen', error);
        }
      );
    }).catch(error => {
      console.error('Error al obtener las dimensiones de la imagen', error);
    });
  }


  checkJobStatus(jobId: string) {
    const jobCheck$ = interval(15000).pipe(
      switchMap(() => this.prodiaService.getJobResult({ job: jobId, status: 'queued' })),
      catchError(() => of(null))
    ).subscribe({
      next: (response) => {
        if (response && response.status === 'succeeded' && response.imageUrl) {
          this.imageUpdated.emit(response.imageUrl);
          jobCheck$.unsubscribe();
        } else if (response && response.status !== 'succeeded') {
          setTimeout(() => this.checkJobStatus(jobId), 5000);
        }
      },
      error: (err) => {
        console.error('Error al verificar el estado del job', err);
        jobCheck$.unsubscribe();
      }
    });
  }


}
