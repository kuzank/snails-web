import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class RouterHelper {

  constructor(private http: HttpClient,
              private injector: Injector) {
  }

  public goTo(url: string, replaceUrl?: false) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url, { replaceUrl: false }), 200);
  }

  public directTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url), 200);
  }

  public back() {
    window.history.back();
  }

  public forward() {
    window.history.forward();
  }
}
