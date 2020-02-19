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

export class G2Timeline3Data {
  /** 非 `Date` 格式，自动使用 `new Date` 转换，因此，支持时间格式字符串、数字型时间戳 */
  x: Date | string | number;
  /** 指标1数据 */
  y1: number;
  /** 指标2数据 */
  y2: number;
  /** 指标3数据 */
  y3: number;

  [key: string]: any;
}

@Component({
  selector: 'g2-timeline3',
  templateUrl: './timeline3.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class timeline3Component implements OnInit, OnDestroy, OnChanges {
  @Input() @InputNumber() delay = 0;
  @Input() title: string | TemplateRef<void>;

  // #region fields
  @Input() data: G2Timeline3Data[] = [];
  @Input() titleMap: { y1: string; y2: string; y3: string };
  @Input() colorMap: { y1: string; y2: string; y3: string } = { y1: '#1890FF', y2: '#2FC25B', y3: '#c28274' };
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
    chart.axis('y1', { title: false });
    chart.axis('y2', false);
    chart.axis('y3', false);

    chart.line().position('x*y1');
    chart.line().position('x*y2');
    chart.line().position('x*y3');

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
        { value: titleMap.y1, fill: colorMap.y1 },
        { value: titleMap.y2, fill: colorMap.y2 },
        { value: titleMap.y3, fill: colorMap.y3 },
      ],
    });

    // border
    chart.get('geoms').forEach((v, idx) => {
      v.color(colorMap[`y${idx + 1}`]).size(borderWidth);
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
      [...data].sort((a, b) => b.y1 - a.y1)[0].y1,
      [...data].sort((a, b) => b.y2 - a.y2)[0].y2,
      [...data].sort((a, b) => b.y3 - a.y3)[0].y3,
    );
    const min = Math.min(
      [...data].sort((a, b) => a.y1 - b.y1)[0].y1,
      [...data].sort((a, b) => a.y2 - b.y2)[0].y2,
      [...data].sort((a, b) => a.y3 - b.y3)[0].y3,
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
      callback: (val: G2Timeline3Data) => {
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
      y1: {
        alias: titleMap.y1,
        max,
        min: min * 0.95,
      },
      y2: {
        alias: titleMap.y2,
        max,
        min: min * 0.95,
      },
      y3: {
        alias: titleMap.y3,
        max,
        min: min * 0.95,
      },
    });
    chart.repaint();
  }
}
