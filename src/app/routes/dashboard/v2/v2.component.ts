import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './v2.component.html',
  styleUrls: ['./v2.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV2Component implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }

  render1(el: ElementRef) {
    fetch('https://g2.antv.vision/zh/examples/data/siteUV.json')
      .then(res => res.json())
      .then(data => {
        const chart = new G2.Chart({
          container: el.nativeElement,
          forceFit: true,
          height: 400,
          padding: [20, 90, 50, 50],
        });
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
          type: 'map',
          callback: function callback(row) {
            const times = row.Time.split(' ');
            row.date = times[0];
            row.time = times[1];
            return row;
          },
        });
        chart.axis('time', {
          label: {
            textStyle: {
              fill: '#aaaaaa',
            },
          },
        });
        chart.axis('Count', {
          label: {
            textStyle: {
              fill: '#aaaaaa',
            },
            formatter: text => {
              return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            },
          },
        });

        chart.tooltip({
          crosshairs: false,
        });

        chart.legend({
          attachLast: true,
        });

        chart.source(dv, {
          time: {
            tickCount: 24,
          },
          date: {
            type: 'cat',
          },
        });

        chart.line().position('time*Count').color('date', ['#d9d9d9', '#1890ff']);

        chart.render();
      });

  }

  render2(el: ElementRef) {
    fetch('https:/g2.antv.vision/zh/examples/data/diamond.json')
      .then(res => res.json())
      .then(data => {
        const chart = new G2.Chart({
          container: el.nativeElement,
          forceFit: true,
          height: 400,
          padding: 'auto',
        });
        chart.scale({
          x: {
            alias: 'depth',
            min: 50,
            max: 70,
            sync: true,
          },
          y: {
            alias: '概率密度分布',
            sync: true,
          },
        });

        [
          'boxcar',
          'cosine',
          'epanechnikov',
          'gaussian',
          'quartic',
          'triangular',
          'tricube',
          'triweight',
          'uniform',
        ].forEach((method, i) => {
          const dv = new DataSet.View().source(data);
          dv.transform({
            type: 'kernel-smooth.regression',
            method,
            field: 'depth',
            extent: [50, 70],
          });

          const view = chart.view();
          !!i && view.axis(false);
          view.source(dv);
          view.line()
            .position('x*y')
            .color(G2.Global.colors_16[i]);
        });

        chart.render();
      });
  }

  render3(el: ElementRef) {

    let tdata = [];
    for (let i = 1; i <= 24; i++) {
      tdata.push({
        type: '方案一',
        Count: i,
        Time: '2020/01/17 ' + i + ':00',
      });
      tdata.push({
        type: '方案二',
        Count: i + 4,
        Time: '2020/01/17 ' + i + ':00',
      });
      tdata.push({
        type: '方案三',
        Count: i + 7,
        Time: '2020/01/17 ' + i + ':00',
      });
    }

    const chart = new G2.Chart({
      container: el.nativeElement,
      forceFit: true,
      height: 400,
      padding: [20, 90, 50, 50],
    });
    const ds = new DataSet();
    const dv = ds.createView().source(tdata);
    dv.transform({
      type: 'map',
      callback: function callback(row) {
        const times = row.Time.split(' ');
        row.date = times[0];
        row.time = times[1];
        return row;
      },
    });
    chart.axis('time', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
        },
      },
    });
    chart.axis('Count', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
        },
        formatter: text => {
          return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
      },
    });

    chart.source(dv, {
      time: {
        tickCount: 24,
      },
      date: {
        type: 'cat',
      },
    });

    chart.tooltip({
      crosshairs: false,
    });
    chart.legend({
      attachLast: true,
    });

    chart.line().position('time*Count').color('type', (type) => { // 通过回调函数
      if (type === '方案一') {
        return 'red';
      }
      if (type === '方案二') {
        return 'green';
      }
      return 'blue';
    });

    chart.render();


  }

}
