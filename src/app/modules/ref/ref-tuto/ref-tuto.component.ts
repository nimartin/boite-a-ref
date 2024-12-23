import { Component, HostListener, OnInit, Output } from '@angular/core';
import { RefService } from '../../../api/ref.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HammerModule } from '@angular/platform-browser';

@Component({
  selector: 'app-ref-tuto',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './ref-tuto.component.html',
  styleUrl: './ref-tuto.component.scss'
})
export class RefTutoComponent implements OnInit{

  constructor(public refService: RefService) { }

  ngOnInit(): void {
    this.refService.refTuto.subscribe((displayed) => {
      this.displayed = displayed;
    });
  }


  displayed = false;

  currentStep = 0;

  steps = [
    {
      title: 'Merci de participer à notre bibliothèque',
      description: 'Tu vas découvrir comment ajouter ta <span class="font-bold text-primary">ref</span> en ligne.<br>C\'est très simple, suis les étapes !<br><br>',
      img: '/assets/illustrations/tuto/step-1.svg'
    },
    {
      title: 'Ouvre la vidéo que tu veux ajouter',
      description: 'Pour l\'instant, on est seulement compatible avec <span class="font-bold text-primary">TikTok</span>.<br><br><br>',
      img: '/assets/illustrations/tuto/step-2.svg'

    },
    {
      title: 'Copie le lien',
      description: '<span class="font-bold text-primary">Copie l\'url</span>, exemple:<br> <em>https://www.tiktok.com/@username/video/123456789</em><br><em>https://vm.tiktok.com/abcd123/</em><br>',
      img: '/assets/illustrations/tuto/step-4.svg'
    },
    {
      title: 'A toi de jouer !',
      description: 'Il te reste plus qu\'à renseigner les infos de ta ref. <br>Et ensuite <span class="font-bold text-primary">colle ton lien</span> dans le champ prévu à cet effet.<br><span class="font-bold text-primary">On s\'occupe du reste !</span>',
      img: '/assets/illustrations/tuto/step-5.svg'
    }
  ];

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  finish() {
    this.close();
  }

  close() {
    this.currentStep = 0;
    this.refService.setShowRefTuto(false);
  }
}
