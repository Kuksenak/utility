import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string | undefined;

  constructor(private swUpdate: SwUpdate) {
    this.isOnline = false;
    this.modalVersion = false;
  }

  public ngOnInit(): void {
    this.updateOnlineStatus();

    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        }),
      );
    }

    // this.loadModalPwa();
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  // private loadModalPwa(): void {
  //   if (this.platform.ANDROID) {
  //     window.addEventListener('beforeinstallprompt', (event: any) => {
  //       event.preventDefault();
  //       this.modalPwaEvent = event;
  //       this.modalPwaPlatform = 'ANDROID';
  //     });
  //   }

  //   if (this.platform.IOS && this.platform.SAFARI) {
  //     const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
  //     if (!isInStandaloneMode) {
  //       this.modalPwaPlatform = 'IOS';
  //     }
  //   }
  // }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }
}
