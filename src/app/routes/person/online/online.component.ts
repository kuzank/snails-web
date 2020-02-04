import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'snails-person-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineComponent implements OnInit {

  data: any[] = [];
  dataOnLoading = false;

  constructor(private http: _HttpClient,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.dataOnLoading = true;

    this.http.post('/person/online').subscribe((res: any) => {

      this.dataOnLoading = false;
      this.data = res.data;
      this.cdr.detectChanges();

    }, error => {
      this.dataOnLoading = false;
    });
  }

}
