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

  colorMap = {
    '方案一': '#2FC25B',
    '方案二': '#c28274',
    '方案三': '#FFD700',
    '方案四': '#DDA0DD',
  };

  constructor() {
  }


  ngOnInit() {
    this.initData1();
    this.initData2();
    this.initData3();
    this.initData4();
  }


  initData1() {
    let data = [];
    for (let i = 1; i < 30; i++) {
      data.push({
        x: i + '号',
        y: Math.floor(Math.random() * 100),
        z: '方案一',
      });
    }
    this.data1 = data;
  }


  initData2() {
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
    }
    this.data2 = data;
  }

  initData3() {
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
    this.data3 = data;
  }

  initData4() {
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
      data.push({
        x: i + '号',
        y: Math.floor(Math.random() * 100),
        z: '方案四',
      });
    }
    this.data4 = data;
  }
}
