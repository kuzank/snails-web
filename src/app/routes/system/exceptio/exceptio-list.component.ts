import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'snails-system-exceptio-list',
  templateUrl: './exceptio-list.component.html',
  styleUrls: ['./exceptio-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExceptioListComponent implements OnInit {

  data: any[] = [];
  personList: any[] = [];
  MethodList: any[] = [{ id: 'GET', title: 'GET' }, { id: 'POST', title: 'POST' }];

  pageNumber: number = 1;
  pageSize: number = 15;
  totalPages: number = 0;
  totalNumber: number = 0;
  dataOnLoading = false;

  sortValue = {};
  _searchPersonid: '';
  _searchMethod: '';
  _searchUrl: '';
  _searchStart: '';
  _searchEnd: '';

  isErrorVisible: any = false;
  errorInfo: any;

  constructor(private http: _HttpClient,
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
      method: this._searchMethod || '',
      url: this._searchUrl || '',
      start: this._searchStart || '',
      end: this._searchEnd || '',
      ...this.sortValue,
    };

    this.http.post('/exceptio/find', body, param).subscribe((res: any) => {
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

  nzPageIndexChange($event: number) {
    this.pageNumber = $event;
    this.search();
  }

  reset() {
    this._searchPersonid = '';
    this._searchMethod = '';
    this._searchUrl = '';
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

  showError(description: (() => string) | string) {
    this.errorInfo = description;
    this.isErrorVisible = true;
  }
}
