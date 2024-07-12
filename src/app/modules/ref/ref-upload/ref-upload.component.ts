import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TikTokService } from '../../../core/services/tiktok.service';
import { Ref } from '../../dashboard/models/ref';
import { Observable } from 'rxjs';
import { RefService } from '../../../api/ref.service';
@Component({
  selector: 'app-ref-upload',
  templateUrl: './ref-upload.component.html',
  styleUrl: './ref-upload.component.scss'
})
export class RefUploadComponent {

  public form!: FormGroup;
  submitted = false;
  ref: Ref;
  public loaded: boolean = false;
  public loading: boolean = false;


  constructor(public formBuilder: FormBuilder, private el: ElementRef, private tiktokService: TikTokService, private refService: RefService) {
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
    console.log('ici');
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
    this.fetchTiktokVideo();
    // this._router.navigate(['/']);
  }

  fetchTiktokVideo(): void {
    this.loading = true;
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
            this.loaded = true;
            this.loading = false;
          }, 2000)
          this.saveRef();
        },
        error: (err) => console.error('Failed to fetch TikTok embed:', err)
      }
    );
  }

  saveRef(): void{
    this.refService.saveRef(this.ref).subscribe({
      next: (createdRef) => console.log('Ref saved successfully:', createdRef),
      error: (err) => console.error('Failed to save ref:', err)
    });
  }

  animate() {
    const svgContainer = this.el.nativeElement.querySelector('.svg-animate');
    if (svgContainer && this.loading) {
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

  get loadingText(): string{
    return this.loaded ? 'Vidéo chargée !' : (this.loading ? 'Chargement...' : `La vidéo s'affichera ici`);
  }

}
