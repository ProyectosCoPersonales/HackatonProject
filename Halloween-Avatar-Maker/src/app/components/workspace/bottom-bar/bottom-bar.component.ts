import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { WorkspaceComponent } from '../workspace.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {
  @Input() imagenUrlOriginal!: string;
  @Output() imageUpdated = new EventEmitter<string>();

  fileName:string = '';

  constructor(@Inject(WorkspaceComponent) private parent: WorkspaceComponent, private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
  aumentarTamano(): void {
    this.parent.incrementar();
  }

  disminuirTamano(): void {
    this.parent.disminuir();
  }

  descargar(): void{
    this.parent.downloadImage(this.fileName);
  }

  setFileName(name: string): void {
    this.fileName = name;
  }
  putOriginal(): void{
    this.imageUpdated.emit(this.imagenUrlOriginal);
  }
  
}
