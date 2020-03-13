import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { deepCopy, InputBoolean, InputNumber } from '@delon/util';
import { Subscription } from 'rxjs';
import * as jsPDF from 'jspdf';

declare var G2: any;
const TITLE_HEIGHT = 41;

export interface G2BarxData {
  x: any;
  y: any;
  z: any;

  [key: string]: any;
}

@Component({
  selector: 'linebar',
  templateUrl: './linebar.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class linebarComponent implements OnInit, OnChanges, OnDestroy {

  // #region fields
  @Input() @InputNumber() delay = 0;
  @Input() title: string | TemplateRef<void>;

  @Input() showtype: 'line' | 'bar' | 'linebar' = 'bar';
  @Input() colorsMap = {}; // G2BarxData --> z 对应的 color

  @Input() data: G2BarxData[] = [];
  @Input() @InputBoolean() autoLabel = true;
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() @InputNumber() height = 400;
  @Input() padding: Array<number | string> | string = 'auto';

  private resize$: Subscription;
  private chart: any;
  @ViewChild('container', { static: true }) private node: ElementRef;

  // #endregion

  constructor(private ngZone: NgZone) {
  }

  ngOnInit() {

    let z = [];
    if (Object.keys(this.colorsMap).length == 0) {
      // 若没有配置 colorMap ，则使用以下默认颜色
      let colors = ['#1890FF', '#2FC25B', '#c28274', '#FFD700', '#DDA0DD'];
      this.data.forEach(item => {
        if (z.indexOf(item.z) == -1) {
          z.push(item.z);
        }
      });
      z.forEach((item, idx) => {
        this.colorsMap[item] = colors[idx];
      });
    }

    this.ngZone.runOutsideAngular(() => setTimeout(() => this.install(), this.delay));
  }

  ngOnChanges(): void {
    this.ngZone.runOutsideAngular(() => this.attachChart());
  }

  private install() {
    const { node, padding, position, colorsMap, showtype } = this;

    const container = node.nativeElement as HTMLElement;
    const chart = (this.chart = new G2.Chart({
      container,
      forceFit: true,
      legend: null,
      height: this.getHeight(),
      padding,
    }));
    this.updatelabel();

    chart.scale('y', {
      alias: '占比（%）',
    });

    chart.axis('x', {
      title: false,
      label: {
        textStyle: { fill: '#aaaaaa' },
      },
      tickLine: {
        alignWithLabel: false,
        length: 0,
      },
    });

    chart.axis('y', {
      title: false,
      label: {
        textStyle: { fill: '#aaaaaa' },
      },
    });

    chart.source([], {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    });

    chart.legend({
      position: position,
    });

    if (showtype == 'line') {
      chart.line().position('x*y').color('z', z => colorsMap[z]);
    }
    if (showtype == 'bar') {
      chart.interval().position('x*y').color('z', z => colorsMap[z])
        .opacity(1)
        .adjust([{
          type: 'dodge',
          marginRatio: 1 / 32,
        }]);
    }
    if (showtype == 'linebar') {
      chart.line().position('x*y').color('z', z => colorsMap[z]);
      chart.interval().position('x*y').color('z', z => colorsMap[z])
        .opacity(1)
        .adjust([{
          type: 'dodge',
          marginRatio: 1 / 32,
        }]);
    }

    chart.render();

    this.attachChart();
  }

  private attachChart() {

    const { chart, height, padding, data } = this;

    if (!chart || !data || data.length <= 0) return;

    let _data = deepCopy(data);
    let _min = 0;
    if (data && data.length > 0) {
      _data = _data.sort((a, b) => a.y - b.y);
      if (_data[0]['y'] < 0) {
        _min = _data[0]['y'];
      }
    }

    if (_min < 0) {
      chart.source([], {
        x: {
          type: 'cat',
        },
        y: {
          min: _min,
          max: 0,
        },
      });
    }

    if (chart.get('height') !== height) {
      chart.changeHeight(height);
    }
    chart.set('padding', padding);

    chart.changeData(data);
  }

  private updatelabel() {
    const { node, data, chart } = this;
    const canvasWidth = node.nativeElement.clientWidth;
    const minWidth = data.length * 30;
    chart.axis('x', canvasWidth > minWidth).repaint();
  }

  private getHeight() {
    return this.title ? this.height - TITLE_HEIGHT : this.height;
  }

  showtypeChange() {
    this.chart.destroy();
    this.ngZone.runOutsideAngular(() => setTimeout(() => this.install(), this.delay));
  }

  downloadImg(name?: string) {
    let title = (name ? name : (this.title ? this.title : '图片')) + '_' + new Date().getTime().toString();
    this.chart.downloadImage(title);
  }

  downloadPdf(name?: string) {
    let imgData = this.chart.toDataURL();
    var doc = new jsPDF();
    doc.addImage(imgData, 1, 1, 200, 100);
    let title = (name ? name : (this.title ? this.title : '图片')) + '_' + new Date().getTime().toString();
    doc.save(title + '.pdf');
  }

  ngOnDestroy(): void {
    if (this.resize$) {
      this.resize$.unsubscribe();
    }
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }
}
