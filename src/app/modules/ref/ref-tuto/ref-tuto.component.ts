import { Component, OnInit, Output } from '@angular/core';
import { RefService } from '../../../api/ref.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-ref-tuto',
  standalone: true,
  imports: [NgIf, NgFor],
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
      description: 'Un message qui dit qu\'on va décrire les étapes',
    },
    {
      title: 'Copie le lien de ta vidéo TikTok',
      description: 'On ne gère que TikTok pour l\'instant, copie le lien de la vidéo',
    },
    {
      title: 'Visionne la vidéo via ton navigateur',
      description: 'Chrome / Safari / Firefox peu importe, ouvre ton navigateur et copies le lien de ta vidéo TikTok',
    },
    {
      title: 'Le nouveau lien est généré',
      description: 'Le lien de la vidéo devrait avoir changé avec le format https://tiktok.com/user/video/1234',
    },
    {
      title: 'Copie le nouveau lien',
      description: 'Copie le nouveau lien dans la barre d\'adresse de ton navigateur',
    },
    {
      title: 'A toi de jouer',
      description: 'Il te reste plus qu\'à renseigner les infos de ta ref et coller ce lien dans le dernier champ',
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

  finish() {
    this.close();
  }

  close() {
    this.refService.setShowRefTuto(false);
  }
}
