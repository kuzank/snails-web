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
import { InputNumber } from '@delon/util';
import * as jsPDF from 'jspdf';

declare var G2: any;
declare var DataSet: any;

export class G2Timeline1Data {
  /** 非 `Date` 格式，自动使用 `new Date` 转换，因此，支持时间格式字符串、数字型时间戳 */
  x: Date | string | number;
  /** 指标1数据 */
  y: number;

  [key: string]: any;
}

@Component({
  selector: 'g2-timeline1',
  templateUrl: './timeline1.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class timeline1Component implements OnInit, OnDestroy, OnChanges {
  @Input() @InputNumber() delay = 0;
  @Input() title: string | TemplateRef<void>;

  // #region fields
  @Input() data: G2Timeline1Data[] = [];
  @Input() titleMap: { y: string };
  @Input() colorMap: { y: string } = { y: '#1890FF' };
  @Input() mask: string = 'HH:mm';
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() @InputNumber() height = 400;
  @Input() padding: number[] | string = [60, 20, 40, 40];
  @Input() @InputNumber() borderWidth = 2;
  @ViewChild('container', { static: false }) private node: ElementRef;
  private chart: any;

  // #endregion

  constructor(private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => setTimeout(() => this.install(), this.delay));
  }

  ngOnChanges(): void {
    this.ngZone.runOutsideAngular(() => this.attachChart());
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }

  downloadImg(name?: string) {
    let title = (name ? name : (this.title ? this.title : '图片')) + '_' + new Date().getTime().toString();
    this.chart.downloadImage(title);
  }

  downloadPdf(name?: string) {
    let imgData = this.chart.toDataURL();
    var doc = new jsPDF();
    doc.addImage(imgData, 10, 40, 180, 180);
    let title = (name ? name : (this.title ? this.title : '图片')) + '_' + new Date().getTime().toString();
    doc.save(title + '.pdf');
  }

  private install() {
    const { node, height, padding, mask } = this;
    const chart = (this.chart = new G2.Chart({
      container: node.nativeElement,
      forceFit: true,
      height,
      padding,
    }));
    chart.axis('x', { title: false });
    chart.axis('y', { title: false });

    chart.line().position('x*y');

    chart.render();

    this.attachChart();
  }

  private attachChart() {
    const {
      chart,
      height,
      padding,
      data,
      mask,
      titleMap,
      position,
      colorMap,
      borderWidth,
    } = this;
    if (!chart || !data || data.length <= 0) return;

    chart.legend({
      position,
      custom: true,
      clickable: false,
      items: [
        { value: titleMap.y, fill: colorMap.y },
      ],
    });

    // border
    chart.get('geoms').forEach((v, idx) => {
      v.color(colorMap[`y`]).size(borderWidth);
    });
    chart.set('height', height);
    chart.set('padding', padding);

    data
      .filter(v => !(v.x instanceof Number))
      .forEach(v => {
        v.x = +new Date(v.x);
      });

    data.sort((a, b) => +a.x - +b.x);

    const max = Math.max(
      [...data].sort((a, b) => b.y - a.y)[0].y,
    );
    const min = Math.min(
      [...data].sort((a, b) => a.y - b.y)[0].y,
    );
    const ds = new DataSet({
      state: {
        start: data[0].x,
        end: data[data.length - 1].x,
      },
    });
    const dv = ds.createView();
    dv.source(data).transform({
      type: 'filter',
      callback: (val: G2Timeline1Data) => {
        const time = +val.x;
        return time >= ds.state.start && time <= ds.state.end;
      },
    });
    chart.source(dv, {
      x: {
        type: 'timeCat',
        mask,
        tickCount: 24,
      },
      y: {
        alias: titleMap.y,
        max,
        min: min * 0.95,
      },
    });
    chart.repaint();
  }
}
