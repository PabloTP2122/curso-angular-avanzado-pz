import {
  Component,
  ElementRef,
  viewChild,
  signal,
  afterNextRender,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-wave-audio',
  imports: [CommonModule],
  templateUrl: './wave-audio.component.html',
})
export class WaveAudioComponent {
  readonly audioUrl = input.required<string>();
  $containerWaveRef = viewChild.required<ElementRef<HTMLDivElement>>('wave');
  private ws!: WaveSurfer;
  isPlaying = signal(false);

  constructor() {
    //Esto se ejecuta luego de que inicializa el browser
    afterNextRender(() => {
      this.ws = WaveSurfer.create({
        url: this.audioUrl(),
        container: this.$containerWaveRef().nativeElement,
      });
      this.ws.on('play', () => this.isPlaying.set(true));
      this.ws.on('pause', () => this.isPlaying.set(false));
    });
  }

  playPause() {
    this.ws.playPause();
  }
}
