import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFComponent, SFRadioWidgetSchema } from '@delon/form';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'snails-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailComponent implements OnInit {

  @Input()
  id: string;

  @ViewChild('sf', { static: false }) sf: SFComponent;

  formData = {};
  schema = {
    'properties': {
      title: {
        type: 'string',
        title: '姓名',
      },
      gender: {
        type: 'string',
        title: '性别',
        ui: {
          widget: 'radio',
          asyncData: () => of([{ label: '男', value: 'Man' }, { label: '女', value: 'Woman' }]).pipe(delay(100)),
          grid: {
            span: 12,
          },
        } as SFRadioWidgetSchema,
        default: '',
      },
      birthdate: {
        type: 'string',
        title: '出生日期',
        format: 'date',
        ui: {
          grid: {
            span: 12,
          },
        },
      },
      phone: {
        type: 'string',
        format: 'mobile',
        title: '手机号',
      },
      email: {
        type: 'string',
        title: '邮箱',
        format: 'email',
      },
      idcard: {
        type: 'string',
        format: 'id-card',
        title: '身份证号',
      },
      address: {
        type: 'string',
        title: '地址',
      },
      description: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
    },
    ui: {
      spanLabelFixed: 70,
      grid: {
        span: 24,
      },
    },
    'required': ['title'],
  };
  layout = 'horizontal';

  constructor(private router: Router,
              private http: _HttpClient,
              private modalRef: NzModalRef,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (this.id) {
      this.http.get(`/person/detail/${this.id}`).subscribe((res: any) => {
        if (res.status === 0) {
          this.formData = deepCopy(res.data);
          this.sf.rootProperty.resetValue(this.formData, false);
          this.cdr.detectChanges();
        } else {
          this.msg.error('记录或已被删除！');
        }
      });
    }
  }

  submit() {
    let data = this.sf.value;
    if (data['id']) {
      this.http.post('/person/edit', data).subscribe((res: any) => {
        this.modalRef.triggerOk();
      });
    } else {
      this.http.post('/person/create', data).subscribe((res: any) => {
        this.modalRef.triggerOk();
      });
    }
  }

  /**
   * 表单数据变更
   * @param data 变更的值
   */
  onFormChange(data) {
    return;
  }

  onFormError(event) {
  }
}
