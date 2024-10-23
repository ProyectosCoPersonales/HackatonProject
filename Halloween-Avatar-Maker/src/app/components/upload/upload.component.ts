import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent {


  isDragging: boolean = false;
  cloudName = "dwnaqwgjk";
  uploadPreset = "test-angular";
  uploadedImageUrl: string = '';


  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.cdr.detectChanges();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    this.cdr.detectChanges();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.uploadImage(file);
    }
    this.cdr.detectChanges();
  }
  goHome() {
    this.router.navigate(['/']);
  }

  goWorkspace() {
    const imageUrl = this.uploadedImageUrl;
    this.router.navigate(['/workspace', { imageUrl }]);
  }
  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length) {
      const file = files[0];
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        this.uploadedImageUrl = data.secure_url;
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error("Error al subir la imagen:", error);
      });
  }



  copyToClipboard(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copiada al portapapeles');
    }).catch(err => {
      console.error('Error al copiar la URL: ', err);
    });
  }
}
