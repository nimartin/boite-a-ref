import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TikTokService } from '../../../core/services/tiktok.service';
import { Ref } from '../../dashboard/models/ref';
import { Observable } from 'rxjs';
import { RefService } from '../../../api/ref.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ref-upload',
  templateUrl: './ref-upload.component.html',
  styleUrl: './ref-upload.component.scss'
})
export class RefUploadComponent {

  public form!: FormGroup;
  submitted = false;
  ref: Ref;
  public uploadState: UploadState = UploadState.EMPTY;
  public uploadStateEnum = UploadState;

  constructor(public formBuilder: FormBuilder, private el: ElementRef, private tiktokService: TikTokService, private refService: RefService, private router: Router) {
    this.ref = {
      id: '',
      title: '',
      memeAuthor: '',
      memeRef: '',
      tiktokVideoId: '',
      tiktokVideoCite: '',
      tiktokVideoThumbnail: '',
      tiktokVideoHtml: ''
    };
  }

  public ngOnInit(): void{
    this.initForm();
  }

  public initForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      memeAuthor: ['', [Validators.required]],
      memeRef: ['', [Validators.required]],
      tiktokVideoCite: ['', [Validators.required]]
    })
  }

  get controls() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.ref = this.form.value as Ref

    this.scrollToViewer();
    this.fetchTiktokVideo();
    // this._router.navigate(['/']);
  }

  fetchTiktokVideo(): void {
    this.uploadState = UploadState.LOADING;
    this.animate();
    const url = this.form.get('tiktokVideoCite')?.value
    this.tiktokService.getTikTokEmbed(url).subscribe(
      {
        next: (tiktokRef: Ref) => {
          this.ref.tiktokVideoId = tiktokRef.tiktokVideoId;
          this.ref.tiktokVideoCite = tiktokRef.tiktokVideoCite;
          this.ref.tiktokVideoHtml = tiktokRef.tiktokVideoHtml;
          this.ref.tiktokVideoThumbnail = tiktokRef.tiktokVideoThumbnail;
          this.tiktokService.loadScript();
          setTimeout(() => {
            this.uploadState = UploadState.LOADED;
          }, 2000)


          this.saveRef();
        },
        error: (err) => {
          console.error('Failed to fetch TikTok embed:', err)
          this.uploadState = UploadState.ERROR;
        }
      }
    );
  }

  scrollToViewer() {
    const viewerElement = this.el.nativeElement.querySelector('#tiktok-viewer');
    if (viewerElement) {
      viewerElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  saveRef(): void{
    this.refService.saveRef(this.ref).subscribe({
      next: (createdRef) => {
        console.log('Ref saved successfully:', createdRef)
        setTimeout(() => {
          this.uploadState = UploadState.UPLOAD;
        }, 2000)
      },
      error: (err) => {
        this.uploadState = UploadState.ERROR;
        ;
      }
    });
  }

  animate() {
    const svgContainer = this.el.nativeElement.querySelector('.svg-animate');
    if (svgContainer && this.uploadState === UploadState.LOADING) {
      const paths = svgContainer.querySelectorAll('path');
      const duration = 0.01; // Duration of the fill animation in seconds
      const delay = 0.05; // Delay between each path fill in seconds

      paths.forEach((path: SVGPathElement, index: number) => {
        path.style.animation = `fillAnimation ${duration}s ${index * delay}s forwards`;
      });

      setTimeout(() => this.resetAnimation(paths), (paths.length * delay + duration) * 1000);
    }
  }

  resetAnimation(paths: NodeListOf<SVGPathElement>) {
    paths.forEach((path: SVGPathElement) => {
      path.style.animation = 'none';
    });

    setTimeout(() => this.animate(), 100);
  }

  modalPrimaryButtonAction(): void {
    if (this.uploadState === UploadState.UPLOAD) {
      this.initForm();
    }
    this.uploadState = UploadState.EMPTY;
  }

  modalSecondaryButtonAction(): void {
    if (this.uploadState === UploadState.UPLOAD) {
      this.router.navigate(['/dashboard/refs']);
    } else {
      this.router.navigate(['/ref/tutorial']);
    }
  }


  get loadingText(): string{
    // If the upload state is loading return loading state
    // If the upload state is loaded or uploaded return loaded state
    // If the upload state is error return error state
    // if the upload state is empty return empty state
    return this.uploadState === UploadState.LOADING ? 'Chargement...' : this.uploadState === UploadState.LOADED ? 'Ta ref est trouvée' : this.uploadState === UploadState.UPLOAD ? 'Ta ref a été importée' : this.uploadState === UploadState.ERROR ? 'Erreur d\'import, réessaye !' : 'La ref s\'affichera ici';
  }

  get isLoaded(): boolean {
    return this.uploadState === UploadState.LOADED || this.uploadState === UploadState.UPLOAD;
  }

  get modalTitle(): string {
    return this.uploadState === UploadState.UPLOAD ? 'Ta ref a été <br>importée' : 'Erreur lors de<br> l\'import !';
  }

  get modalMessage(): string {
    return this.uploadState === UploadState.UPLOAD ? 'Merci pour ton aide...<br>La ref est en cours de validation' : 'Quelque chose ne s\'est pas passé correctement...';
  }

  get modalPrimaryButton(): string {
    return this.uploadState === UploadState.UPLOAD ? 'Ajoute une autre ref !' : 'Essaye à nouveau !';
  }

  get modalSecondaryButton(): string {
    return this.uploadState === UploadState.UPLOAD ? 'Retour à l\'accueil' : 'Visionne le tutoriel';
  }

  get showModal(): boolean {
    return this.uploadState === UploadState.UPLOAD || this.uploadState === UploadState.ERROR;
  }
}

export enum UploadState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  EMPTY = 'empty',
  UPLOAD = 'upload'
}
