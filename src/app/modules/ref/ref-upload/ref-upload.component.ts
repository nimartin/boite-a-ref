import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-ref-upload',
  templateUrl: './ref-upload.component.html',
  styleUrl: './ref-upload.component.scss'
})
export class RefUploadComponent {

  public form!: FormGroup;
  submitted = false;

  constructor(public formBuilder: FormBuilder) {

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
      tiktokVideoCite: ['', [Validators.required]],
      tiktokVideoId: ['', [Validators.required]],
      tiktokVideoThumbnail: ['', [Validators.required]]
    })
  }

  get controls() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // this._router.navigate(['/']);
  }

}
