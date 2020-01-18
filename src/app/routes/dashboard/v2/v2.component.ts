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
    // 开始编写 G2 代码
    const data = [
      { company: 'Apple', type: '整体', value: 30 },
      { company: 'Facebook', type: '整体', value: 35 },
      { company: 'Google', type: '整体', value: 28 },

      { company: 'Apple', type: '非技术岗', value: 40 },
      { company: 'Facebook', type: '非技术岗', value: 65 },
      { company: 'Google', type: '非技术岗', value: 47 },

      { company: 'Apple', type: '技术岗', value: 23 },
      { company: 'Facebook', type: '技术岗', value: 18 },
      { company: 'Google', type: '技术岗', value: 20 },

      { company: 'Apple', type: '技术岗', value: 35 },
      { company: 'Facebook', type: '技术岗', value: 30 },
      { company: 'Google', type: '技术岗', value: 25 },
    ];

    const chart = new G2.Chart({
      container: el.nativeElement,
      forceFit: true,
      height: 400,
      padding: 'auto',
    });
    chart.source(data);

    chart.scale('value', {
      alias: '占比（%）',
      max: 75,
      min: 0,
      tickCount: 4,
    });

    chart.axis('type', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
        },
      },
      tickLine: {
        alignWithLabel: false,
        length: 0,
      },
    });
    chart.axis('value', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
        },
      },
      title: {
        offset: 50,
      },
    });

    chart.legend({
      position: 'top-center',
    });

    chart.interval().position('type*value').color('company')
      .opacity(1)
      .adjust([{
        type: 'dodge',
        marginRatio: 1 / 32,
      }]);
    chart.render();

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
}
