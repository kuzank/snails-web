import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ArrayService, deepCopy } from '@delon/util';
import { ArrayServiceArrToTreeNodeOptions } from '@delon/util/src/array/array.service';
import { NzTreeNode } from 'ng-zorro-antd/core';

@Component({
  selector: 'snails-system-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {

  menuTreeNodes: NzTreeNode[] = [];
  _menuTreeNodes: NzTreeNode[] = [];

  // 点击组织后，根据组织ID获取的组织信息
  menuSelectData = {
    personList: [],
    menu: {
      id: '',
      title: '',
      pid: null,
      url: null,
      icon: null,
      description: '',
    },
  };

  menuList: any[] = [];
  personList: any[] = [];

  isMenuVisible = false;
  // modal 中填写的数据
  createMenuData_title = '';
  createMenuData_pid = null;
  createMenuData_url = null;
  createMenuData_icon = null;
  createMenuData_description = '';


  constructor(private router: Router,
              private http: _HttpClient,
              private module: NzModalService,
              private message: NzMessageService,
              private arrayService: ArrayService,
              private cdr: ChangeDetectorRef) {
    this.initPersonList();
    this.initMenu();
  }

  ngOnInit(): void {
  }

  TreeOnClick(event: NzFormatEmitEvent): void {
    let data = event.node.origin;
    this.http.get(`/menu/detail/${data.id}`).subscribe((res: any) => {
      if (res.status === 0) {
        this.menuSelectData = res.data;
        this.cdr.detectChanges();
      }
    }, error => {
    });
  }

  private initMenu() {
    let option: ArrayServiceArrToTreeNodeOptions = { parentIdMapName: 'pid' };
    this.http.get('/menu/list').subscribe((res: any) => {
      this.message.success('数据加载成功');
      let data: NzTreeNode[] = [];
      let _data: NzTreeNode[] = [];
      if (res.status === 0) {
        data = res.data as any[];
        _data = deepCopy(data);

        this.menuList = deepCopy(data);
        // list --> treeNode
        data = this.arrayService.arrToTreeNode(data, option);
        _data = this.arrayService.arrToTreeNode(_data, option);

        // 第一排展开
        data.forEach(item => item.isExpanded = true);
        _data.forEach(item => item.isExpanded = true);
      }
      this.menuTreeNodes = data;
      this._menuTreeNodes = _data;
      this.cdr.detectChanges();
    }, error => {
    });
  }

  refresh() {
    this.emptyTreeSelect();
    this.initMenu();
  }

  edit() {
    if (!this.menuSelectData.menu.id) {
      this.message.error('请选择组织！');
      return;
    }
    if (!this.menuSelectData.menu.title) {
      this.message.error('请填写组织名称！');
      return;
    }

    let data = this.menuSelectData.menu;
    this.http.post('/menu/edit', data, {}).subscribe((res: any) => {
      if (res.status === 0) {
        this.message.success('修改成功');
        this.initMenu();
      }
    }, error => {
    });
  }

  delete() {
    if (this.menuSelectData.menu.id) {
      this.http.get(`/menu/delete/${this.menuSelectData.menu.id}`).subscribe((res: any) => {
        if (res.status === 0) {
          this.emptyTreeSelect();
          this.initMenu();
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
    this.isMenuVisible = false;
  }

  handleModalOk() {
    if (this.createMenuData_title) {
      let data = {
        title: this.createMenuData_title,
        pid: this.createMenuData_pid,
        url: this.createMenuData_url,
        icon: this.createMenuData_icon,
        description: this.createMenuData_description,
      };
      this.http.post('/menu/create', data, {}).subscribe((res: any) => {
        if (res.status === 0) {
          this.message.success('创建成功');
          this.refresh();
          this.isMenuVisible = false;
        }
      }, error => {
      });
    } else {
      this.message.warning('请填写完整组织信息！');
    }
  }

  emptyTreeSelect() {
    this.menuSelectData = {
      personList: [],
      menu: {
        id: '',
        title: '',
        pid: null,
        url: null,
        icon: null,
        description: '',
      },
    };
  }

  onClickCreateMenu() {
    this.createMenuData_title = '';
    this.createMenuData_pid = null;
    this.createMenuData_url = null;
    this.createMenuData_icon = null;
    this.createMenuData_description = '';
    this.isMenuVisible = true;
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
