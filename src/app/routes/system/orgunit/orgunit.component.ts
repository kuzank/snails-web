import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ArrayService, deepCopy } from '@delon/util';
import { ArrayServiceArrToTreeNodeOptions } from '@delon/util/src/array/array.service';
import { NzTreeNode } from 'ng-zorro-antd/core';

@Component({
  selector: 'snails-system-orgunit',
  templateUrl: './orgunit.component.html',
  styleUrls: ['./orgunit.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgunitComponent implements OnInit {

  orgunitTreeNodes: NzTreeNode[] = [];
  _orgunitTreeNodes: NzTreeNode[] = [];

  // 点击组织后，根据组织ID获取的组织信息
  orgunitSelectData = {
    personList: [],
    orgunit: {
      id: '',
      title: '',
      charge: null,
      pid: null,
      description: '',
    },
    peoples: null,
  };

  orgunitList: any[] = [];
  personList: any[] = [];

  isOrgunitVisible = false;
  // modal 中填写的数据
  createOrgunitData_title = '';
  createOrgunitData_charge = null;
  createOrgunitData_pid = null;
  createOrgunitData_description = '';
  createOrgunitData_peoples = null;


  constructor(private router: Router,
              private http: _HttpClient,
              private module: NzModalService,
              private message: NzMessageService,
              private arrayService: ArrayService,
              private cdr: ChangeDetectorRef) {
    this.initPersonList();
    this.initOrgunit();
  }

  ngOnInit(): void {
  }

  TreeOnClick(event: NzFormatEmitEvent): void {
    let data = event.node.origin;
    this.http.get(`/orgunit/detail/${data.id}`).subscribe((res: any) => {
      if (res.status === 0) {
        this.orgunitSelectData = res.data;
        let personList = res.data.personList as any[];
        if (personList && personList.length > 0) {
          let ids = [];
          personList.forEach(item => ids.push(item.id));
          this.orgunitSelectData.peoples = ids;
        }
        this.cdr.detectChanges();
      }
    }, error => {
    });
  }

  private initOrgunit() {
    let option: ArrayServiceArrToTreeNodeOptions = { parentIdMapName: 'pid' };
    this.http.get('/orgunit/list').subscribe((res: any) => {
      this.message.success('数据加载成功');
      let data: NzTreeNode[] = [];
      let _data: NzTreeNode[] = [];
      if (res.status === 0) {
        data = res.data as any[];
        _data = deepCopy(data);

        this.orgunitList = deepCopy(data);
        // list --> treeNode
        data = this.arrayService.arrToTreeNode(data, option);
        _data = this.arrayService.arrToTreeNode(_data, option);

        // 第一排展开
        data.forEach(item => item.isExpanded = true);
        _data.forEach(item => item.isExpanded = true);
      }
      this.orgunitTreeNodes = data;
      this._orgunitTreeNodes = _data;
      this.cdr.detectChanges();
    }, error => {
    });
  }

  refresh() {
    this.emptyTreeSelect();
    this.initOrgunit();
  }

  edit() {
    if (!this.orgunitSelectData.orgunit.id) {
      this.message.error('请选择组织！');
      return;
    }
    if (!this.orgunitSelectData.orgunit.title) {
      this.message.error('请填写组织名称！');
      return;
    }

    let data = this.orgunitSelectData.orgunit;
    let param = {
      ids: this.orgunitSelectData.peoples ? this.orgunitSelectData.peoples.toString() : '',
    };
    this.http.post('/orgunit/edit', data, param).subscribe((res: any) => {
      if (res.status === 0) {
        this.message.success('修改成功');
        this.initOrgunit();
      }
    }, error => {
    });
  }

  delete() {
    if (this.orgunitSelectData.orgunit.id) {
      this.http.get(`/orgunit/delete/${this.orgunitSelectData.orgunit.id}`).subscribe((res: any) => {
        if (res.status === 0) {
          this.emptyTreeSelect();
          this.initOrgunit();
          this.message.success('删除成功');
          this.cdr.detectChanges();
        }
      }, error => {
      });
    } else {
      this.message.error('请选择组织！');
    }
  }

  handleModalCancel() {
    this.isOrgunitVisible = false;
  }

  handleModalOk() {
    if (this.createOrgunitData_title) {
      let data = {
        title: this.createOrgunitData_title,
        charge: this.createOrgunitData_charge,
        pid: this.createOrgunitData_pid,
        description: this.createOrgunitData_description,
      };
      let param = {
        ids: this.createOrgunitData_peoples ? this.createOrgunitData_peoples.toString() : '',
      };
      this.http.post('/orgunit/create', data, param).subscribe((res: any) => {
        if (res.status === 0) {
          this.message.success('创建成功');
          this.refresh();
          this.isOrgunitVisible = false;
        }
      }, error => {
      });
    } else {
      this.message.warning('请填写完整组织信息！');
    }
  }

  emptyTreeSelect() {
    this.orgunitSelectData = {
      personList: [],
      orgunit: {
        id: '',
        title: '',
        charge: null,
        pid: null,
        description: '',
      },
      peoples: null,
    };
  }

  onClickCreateOrgunit() {
    this.createOrgunitData_title = '';
    this.createOrgunitData_charge = null;
    this.createOrgunitData_pid = null;
    this.createOrgunitData_description = '';
    this.createOrgunitData_peoples = null;
    this.isOrgunitVisible = true;
  }

  private initPersonList() {
    let param = {
      pageNumber: 0,
      pageSize: 10000,
    };

    this.http.post('/person/find', {}, param).subscribe((res: any) => {
      this.message.success('数据加载成功');
      if (res.status === 0) {
        let d = res.data.content as any[];
        this.personList = d;
      }
    }, error => {
    });
  }
}
