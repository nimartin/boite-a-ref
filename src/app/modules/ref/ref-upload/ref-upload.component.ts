import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TikTokService } from '../../../api/tiktok.service';
import { Ref } from '../../dashboard/models/ref';
import { Observable } from 'rxjs';
import { RefService } from '../../../api/ref.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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

  constructor(public formBuilder: FormBuilder, private el: ElementRef, private tiktokService: TikTokService,
    private refService: RefService, private router: Router, private sanitizer: DomSanitizer) {
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
      title: ['' ],
      memeAuthor: [''],
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
    this.ref.title = this.ref.memeAuthor ? `${this.ref.memeAuthor} - ${this.ref.memeRef}` : this.ref.memeRef;
    if (this.ref.memeAuthor.trim() === '') {
      this.ref.memeAuthor = 'Inconnu';
    }
    this.refService.saveRef(this.ref).subscribe({
      next: (createdRef) => {
        this.ref.id = createdRef.id;
        console.log('Ref saved successfully:', createdRef)
        setTimeout(() => {
          this.uploadState = UploadState.UPLOAD;
        }, 2000)
      },
      error: (err) => {
        console.log('Failed to save ref:', err)
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
      this.router.navigate(['/refs', this.ref.id]);
    }
    this.uploadState = UploadState.EMPTY;
  }

  modalSecondaryButtonAction(): void {
    if (this.uploadState === UploadState.UPLOAD) {
      this.initForm();
    } else {
      this.openTuto();
    }
  }

  openTuto(): void {
    this.refService.setShowRefTuto(true);
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
    return this.uploadState === UploadState.UPLOAD ? 'Visionne ta ref !' : 'Essaye à nouveau !';
  }

  get modalSecondaryButton(): string {
    return this.uploadState === UploadState.UPLOAD ? 'Ajoute une autre ref !' : 'Visionne le tutoriel';
  }

  get showModal(): boolean {
    return this.uploadState === UploadState.UPLOAD || this.uploadState === UploadState.ERROR;
  }

  get tiktokVideoUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.tiktok.com/player/v1/' + this.ref?.tiktokVideoId + this.params);
  }

  get params(): string {
    return '?&music_info=1&description=1&loop=1';
  }
}

export enum UploadState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  EMPTY = 'empty',
  UPLOAD = 'upload'
}
