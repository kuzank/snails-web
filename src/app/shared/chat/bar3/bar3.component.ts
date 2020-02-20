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
import { InputBoolean, InputNumber } from '@delon/util';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import * as jsPDF from 'jspdf';

declare var G2: any;
const TITLE_HEIGHT = 41;

export interface G2BarData {
  x: any;
  y: any;

  [key: string]: any;
}

@Component({
  selector: 'bar3',
  templateUrl: './bar3.component.html',
  host: {
    '[style.height.px]': 'height',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class bar3Component implements OnInit, OnChanges, OnDestroy {
  @Input() @InputNumber() delay = 0;
  @Input() title: string | TemplateRef<void>;
  @Input() color = 'rgba(24, 144, 255, 0.85)';

  // #region fields
  @Input() @InputNumber() height = 0;
  @Input() padding: Array<number | string> | string = 'auto';
  @Input() data: G2BarData[] = [];
  @Input() @InputBoolean() autoLabel = true;
  colors = ['#1890FF', '#2FC25B', '#c28274'];
  private resize$: Subscription;
  private chart: any;
  @ViewChild('container', { static: true }) private node: ElementRef;

  // #endregion

  constructor(private ngZone: NgZone) {
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setTimeout(() => this.install(), this.delay));
  }

  ngOnChanges(): void {
    this.ngZone.runOutsideAngular(() => this.attachChart());
  }

  ngOnDestroy(): void {
    if (this.resize$) {
      this.resize$.unsubscribe();
    }
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
    doc.addImage(imgData, 1, 1, 200, 100);
    let title = (name ? name : (this.title ? this.title : '图片')) + '_' + new Date().getTime().toString();
    doc.save(title + '.pdf');
  }

  private getHeight() {
    return this.title ? this.height - TITLE_HEIGHT : this.height;
  }

  private install() {
    const { node, padding } = this;

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
      line: false,
      tickLine: false,
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
      position: 'top-center',
    });
    chart.interval().position('x*y').color('z')
      .opacity(1)
      .adjust([{
        type: 'dodge',
        marginRatio: 1 / 32,
      }]);

    chart.render();

    this.attachChart();
  }

  private attachChart() {
    const { chart, padding, data, color } = this;
    if (!chart || !data || data.length <= 0) return;
    this.installResizeEvent();
    const height = this.getHeight();
    if (chart.get('height') !== height) {
      chart.changeHeight(height);
    }
    // color
    // chart.get('geoms')[0].color(color);
    chart.set('padding', padding);

    chart.changeData(data);
  }

  private updatelabel() {
    const { node, data, chart } = this;
    const canvasWidth = node.nativeElement.clientWidth;
    const minWidth = data.length * 30;
    chart.axis('x', canvasWidth > minWidth).repaint();
  }

  private installResizeEvent() {
    if (!this.autoLabel || this.resize$) return;

    this.resize$ = fromEvent(window, 'resize')
      .pipe(
        filter(() => this.chart),
        debounceTime(200),
      )
      .subscribe(() => this.ngZone.runOutsideAngular(() => this.updatelabel()));
  }
}
