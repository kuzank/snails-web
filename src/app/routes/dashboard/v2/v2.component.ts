import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './v2.component.html',
  styleUrls: ['./v2.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV2Component implements OnInit {

  data1 = [];
  data2 = [];
  data3 = [];
  data4 = [];
  data5 = [];
  data6 = [];

  constructor() {
  }


  ngOnInit() {
    this.initG2Timeline3Data1();
    this.initG2Timeline3Data2();
    this.initG2Timeline3Data3();
    this.initG2Timeline3Data4();
    this.initBar3Data5();
    this.initBar3Data6();
  }

  initG2Timeline3Data1() {
    let data = [];
    for (let i = 0; i <= 24; i++) {
      data.push({
        x: (new Date('2020-02-19 00:00:00').getTime()) + (60 * 60 * 1000 * i),
        y1: Math.floor(Math.random() * 50),
        y2: Math.floor(Math.random() * 50),
        y3: Math.floor(Math.random() * 50),
      });
    }
    this.data1 = data;
  }

  initG2Timeline3Data2() {
    let data = [];
    for (let i = 1; i < 29; i++) {
      data.push({
        x: new Date('2020-02-' + i),
        y1: Math.floor(Math.random() * 50) + 15,
        y2: Math.floor(Math.random() * 50) + 15,
        y3: Math.floor(Math.random() * 50) + 15,
      });
    }
    this.data2 = data;
  }

  initG2Timeline3Data3() {
    let data = [];
    for (let i = 0; i <= 24; i++) {
      data.push({
        x: (new Date('2020-02-19 00:00:00').getTime()) + (60 * 60 * 1000 * i),
        y: Math.floor(Math.random() * 50),
      });
    }
    this.data3 = data;
  }

  initG2Timeline3Data4() {
    let data = [];
    for (let i = 1; i < 29; i++) {
      data.push({
        x: new Date('2020-02-' + i),
        y: Math.floor(Math.random() * 50) + 15,
      });
    }
    this.data4 = data;
  }

  initBar3Data5() {
    let data = [];
    for (let i = 1; i < 25; i++) {
      data.push({
        x: i + ':00',
        y: Math.floor(Math.random() * 100),
        z: '方案一',
      });
      data.push({
        x: i + ':00',
        y: Math.floor(Math.random() * 100),
        z: '方案二',
      });
      data.push({
        x: i + ':00',
        y: Math.floor(Math.random() * 100),
        z: '方案三',
      });
    }
    this.data5 = data;
  }

  initBar3Data6() {
    let data = [];
    for (let i = 1; i < 30; i++) {
      data.push({
        x: i + '号',
        y: Math.floor(Math.random() * 100),
        z: '方案一',
      });
      data.push({
        x: i + '号',
        y: Math.floor(Math.random() * 100),
        z: '方案二',
      });
      data.push({
        x: i + '号',
        y: Math.floor(Math.random() * 100),
        z: '方案三',
      });
    }
    this.data6 = data;
  }
}
