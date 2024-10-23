import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { WorkspaceComponent } from '../workspace.component';
import { CommonModule } from '@angular/common';
import { ImageService } from 'src/app/service/image.service';

@Component({
  selector: 'app-layer-box',
  standalone: true,
  imports: [WorkspaceComponent, CommonModule],
  templateUrl: './layer-box.component.html',
  styleUrls: ['./layer-box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayerBoxComponent {
  @Input() imageUrlEdited!: string;
  @Output() imageUpdated = new EventEmitter<string>();
  cloudinaryUrl: string = '';

  constructor(private imageService: ImageService, @Inject(WorkspaceComponent) private parent: WorkspaceComponent, private cdr: ChangeDetectorRef) { }

  handleImageUpload(): void {
    this.imageService.uploadToCloudinary(this.imageUrlEdited).then((response) => {
      if (response) {
        this.cloudinaryUrl = response.secure_url;
      } else {
        this.cloudinaryUrl = this.imageUrlEdited;
      }
      this.imageUpdated.emit(this.cloudinaryUrl);

    }).catch((error) => {
      console.error('Error al subir la imagen a Cloudinary:', error);
    });
  }

  async changeAspectRatio(ratio: string): Promise<void> {
    this.parent.showLoading(5);
    await this.handleImageUpload();

    await new Promise(resolve => setTimeout(resolve, 5000));
    let aspectRatio: number;
    let width: number;

    switch (ratio) {
      case '1:2':
        aspectRatio = 0.5;
        width = 433;
        break;
      case '5:2':
        aspectRatio = 2.5;
        width = 1300;
        break;
      case '1:1':
      default:
        aspectRatio = 1.0;
        width = 867;
        break;
    }

    const cloudName = 'dwnaqwgjk';
    const publicId = this.cloudinaryUrl.split('/').pop();

    const newImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/ar_${aspectRatio},c_fill,g_auto,w_${width}/q_auto/f_auto/${publicId}`;
    this.imageUpdated.emit(newImageUrl);

  }
  async optimizeImage(resolution: string): Promise<void> {
    this.parent.showLoading(5);
    await this.handleImageUpload();
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (!this.cloudinaryUrl) {
      console.error('La URL de Cloudinary no está disponible.');
      return;
    }

    let width: number;
    switch (resolution) {
      case '720p':
        this.parent.showLoading(25);
        width = 1280;
        break;
      case '1080p':
        this.parent.showLoading(25);
        width = 1920;
        break;
      case '4K':
        this.parent.showLoading(25);
        width = 3840;
        break;
      default:
        console.error('Resolución no soportada');
        return;
    }

    const cloudName = 'dwnaqwgjk';
    const publicId = this.cloudinaryUrl.split('/').pop();

    const optimizedImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,w_${width}/q_auto/f_auto/${publicId}`;
    this.imageUpdated.emit(optimizedImageUrl);
  }

  async changeAspectRatiowithFill(ratio: string): Promise<void> {
    try {
      this.parent.showLoading(5);
      await this.handleImageUpload();

      await new Promise(resolve => setTimeout(resolve, 5000));

      let aspectRatio: number;
      let width: number;

      switch (ratio) {
        case '1:1':
          aspectRatio = 1.0;
          width = 867;
          break;
        case '4:3':
          aspectRatio = 1.33;
          width = 1153;
          break;
        case '3:4':
          aspectRatio = 0.75;
          width = 650;
          break;
        default:
          aspectRatio = 1.0;
          width = 867;
          break;
      }

      const cloudName = 'dwnaqwgjk';
      const publicId = this.cloudinaryUrl.split('/').pop();
      const newImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/ar_${aspectRatio},c_pad,b_gen_fill,w_${width}/q_auto/f_auto/${publicId}`;

      this.imageUpdated.emit(newImageUrl);
    } catch (error) {
      console.error('Error al cambiar la relación de aspecto con relleno generativo:', error);
    }
  }

  backgrounds: { [key: string]: string } = {
    bosque_tenebroso: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594738/Bosque_Tenebroso-transformed_fhodky.png',
    bosque_encantado: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594735/Bosque_encantado_nqy30k.png',
    fabrica: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594727/F%C3%A1brica_Abandonada_ooqs63.png',
    castillo: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594745/Castillo_rkj7wa.png',
    mar: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594728/Mar_Abandonado_mt84wk.png',
    puente: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594732/Puente_Roto_outhbu.png',
    cementerio_animales: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594752/Cementerio_de_animales_wjg0zv.png',
    casa_abandonada: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594742/Casa_Abandonada_fcou7k.png',
    cueva_oscura: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594708/Cueva_Oscura_phq9pt.png',
    cementerio_abandonado: 'https://res.cloudinary.com/dwnaqwgjk/image/upload/v1729594707/Cementerio_Abandonado-transformed_vsmdid.png',
  };

  onBackgroundSelect(event: Event): void {
    const selectedBackground = (event.target as HTMLSelectElement).value;
    if (selectedBackground) {
      this.applyBackground(selectedBackground);
    } else {
      console.warn('No se seleccionó ningún fondo.');
    }
  }

  async applyBackground(backgroundKey: string): Promise<void> {
  
    this.parent.showLoading(20);
    await this.handleImageUpload(); 

    await new Promise(resolve => setTimeout(resolve, 5000));

    const cloudName = 'dwnaqwgjk';
    const backgroundUrl = this.backgrounds[backgroundKey]; 

    if (!backgroundUrl) {
        console.error('Error: No se encontró el fondo seleccionado.');
        return;
    }

    const backgroundUrlParts = backgroundUrl.split('/');
    const backgroundPublicId = backgroundUrlParts.pop()!.split('.')[0];

    const imageUrlParts = this.cloudinaryUrl.split('/');
    let imagePublicId = imageUrlParts.pop()!;
    imagePublicId = imagePublicId.split('.')[0];


    const baseCloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
    const backgroundRemovalEffect = 'e_background_removal/'; 
    const layerApplication = `u_image:upload:${backgroundPublicId}/`; 
    const transformationParams = 'c_thumb,w_1.0,h_1.0,fl_relative.layer_apply/'; 
    const finalFormat = 'f_png/'; 

    const newImageUrl = `${baseCloudinaryUrl}${backgroundRemovalEffect}${layerApplication}${transformationParams}${finalFormat}${imagePublicId}`;
    
    
    try {
      await fetch(newImageUrl); 
  } catch {
     
  }
    await new Promise(resolve => setTimeout(resolve, 10000));
    this.imageUpdated.emit(newImageUrl);
}

}
