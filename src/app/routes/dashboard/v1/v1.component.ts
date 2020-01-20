import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RouterHelper } from '@core/helper/RouterHelper';

@Component({
  selector: 'app-dashboard-v1',
  templateUrl: './v1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV1Component implements OnInit {

  onlinePersons = [];
  personNum = 0;
  exceptioNum = 0;
  httpLogNum = 0;

  salesData: any[];
  offlineChartData: any[];

  constructor(private http: _HttpClient,
              private routerHelper: RouterHelper,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    let param = {
      pageNumber: 0,
      pageSize: 100000,
    };
    zip(
      this.http.post(`/person/online`),
      this.http.get('/person/num'),
      this.http.get('/exceptio/num'),
      this.http.get('/httpLog/num'),
    ).pipe(
      // 接收其他拦截器后产生的异常消息
      catchError(([online, personNum, exceptioNum, httpLogNum]) => {
        return [online, personNum, exceptioNum, httpLogNum];
      }),
    ).subscribe(([online, personNum, exceptioNum, httpLogNum]) => {

        this.onlinePersons = online.data as [];
        this.personNum = personNum.data;
        this.exceptioNum = exceptioNum.data;
        this.httpLogNum = httpLogNum.data;

        // 假数据
        this.mockData();

        this.cdr.detectChanges();
      },
    );

  }

  mockData() {
    let _salesData = [];
    for (let i = 0; i < 12; i += 1) {
      _salesData.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200,
      });
    }
    this.salesData = _salesData;

    const _offlineChartData: any[] = [];
    for (let i = 0; i < 20; i += 1) {
      _offlineChartData.push({
        x: new Date().getTime() + 1000 * 60 * 30 * i,
        y1: Math.floor(Math.random() * 100) + 10,
        y2: 0,
      });
    }
    this.offlineChartData = _offlineChartData;
  }

  goTo(url: string) {
    this.routerHelper.goTo(url, false);
  }
}
