import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';
import { PersonDetailComponent } from '../detail/person-detail.component';

@Component({
  selector: 'snails-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListComponent implements OnInit {

  data: any[] = [];
  orgunitList: any[] = [];

  pageNumber: number = 1;
  pageSize: number = 15;
  totalPages: number = 0;
  totalNumber: number = 0;
  dataOnLoading = false;

  sortValue = {};
  _searchTitle: '';
  _searchPhone: '';
  _searchAddress: '';
  _searchGender: '';

  genders = [{ text: '男', value: 'Man' }, { text: '女', value: 'Woman' }];


  constructor(private router: Router,
              private http: _HttpClient,
              private module: NzModalService,
              private cdr: ChangeDetectorRef) {
    this.initOrgunitList();
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
      title: this._searchTitle || '',
      phone: this._searchPhone || '',
      address: this._searchAddress || '',
      gender: this._searchGender || '',
      ...this.sortValue,
    };

    this.http.post('/person/find', body, param).subscribe((res: any) => {
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

  keydown($event: KeyboardEvent) {
    if ($event.key == 'Enter') {
      this.search();
    }
  }

  delete(obj: any) {
    this.http.get(`/person/delete/${obj.id}`).subscribe((res: any) => {
      if (res.status === 0) {
        this.search();
      }
    });
  }

  edit(obj: any) {
    this.module.create({
      nzTitle: '编辑用户',
      nzComponentParams: { id: obj.id },
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
    this._searchTitle = '';
    this._searchPhone = '';
    this._searchAddress = '';

    this.search();
  }

  genderFilterChange($event: any[]) {
    if ($event && ($event.length == 0 || $event.length == 2)) {
      this._searchGender = '';
    }
    if ($event && $event.length == 1) {
      this._searchGender = $event[0];
    }
    this.search();
  }

  sortChange($event: { key: string; value: string }) {
    this.sortValue[$event.key] = $event.value;
    this.search();
  }


  getOrgunitName(id: string) {
    let title = this.orgunitList.find(item => item.id === id);
    if (title) {
      return title.title;
    }
    return '';
  }

  private initOrgunitList() {
    this.http.get('/orgunit/list').subscribe((res: any) => {
      if (res.status === 0) {
        let d = res.data as any[];
        this.orgunitList = d;
      }
    }, error => {
    });
  }
}
