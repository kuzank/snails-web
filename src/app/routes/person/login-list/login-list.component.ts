import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';
import { PersonDetailComponent } from '../detail/person-detail.component';

@Component({
  selector: 'snails-person-login-list',
  templateUrl: './login-list.component.html',
  styleUrls: ['./login-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginListComponent implements OnInit {

  data: any[] = [];
  personList: any[] = [];

  pageNumber: number = 1;
  pageSize: number = 15;
  totalPages: number = 0;
  totalNumber: number = 0;
  dataOnLoading = false;

  sortValue = {};
  _searchPersonid: '';
  _searchStart: '';
  _searchEnd: '';


  constructor(private router: Router,
              private http: _HttpClient,
              private module: NzModalService,
              private cdr: ChangeDetectorRef) {
    this.initPersonList();
  }


  ngOnInit(): void {
    this.search();
  }

  search() {
    this.dataOnLoading = true;

    let param = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
    };

    let body = {
      personid: this._searchPersonid || '',
      start: this._searchStart || '',
      end: this._searchEnd || '',
      ...this.sortValue,
    };

    this.http.post('/person/log', body, param).subscribe((res: any) => {
      this.dataOnLoading = false;

      if (res.status === 0) {
        this.data = res.data.content as any[];
        this.totalPages = res.data.totalPages;
        this.totalNumber = res.data.totalElements;

        this.cdr.detectChanges();
      }
    }, error => {
      this.dataOnLoading = false;
    });
  }

  nzPageIndexChange($event: number) {
    this.pageNumber = $event;
    this.search();
  }

  create() {
    this.module.create({
      nzTitle: '新增用户',
      nzComponentParams: {},
      nzContent: PersonDetailComponent,
      nzMaskClosable: true,
      nzWidth: 900,
      nzOnOk: () => {
        this.search();
      },
      nzBodyStyle: {
        padding: '10px',
      },
      nzFooter: null,
    });
  }

  reset() {
    this._searchPersonid = '';
    this._searchStart = '';
    this._searchEnd = '';

    this.search();
  }

  sortChange($event: { key: string; value: string }) {
    this.sortValue[$event.key] = $event.value;
    this.search();
  }

  getPersonName(id: string) {
    let title = this.personList.find(item => item.id === id);
    if (title) {
      return title.title;
    }
    return '';
  }

  private initPersonList() {
    let param = {
      pageNumber: 0,
      pageSize: 10000,
    };

    this.http.post('/person/find', {}, param).subscribe((res: any) => {

      if (res.status === 0) {
        let d = res.data.content as any[];
        this.personList = d;
      }
    }, error => {
    });
  }
}
