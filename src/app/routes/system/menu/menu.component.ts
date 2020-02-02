import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService, NzModalService, NzTreeComponent } from 'ng-zorro-antd';
import { ArrayService, deepCopy } from '@delon/util';
import { ArrayServiceArrToTreeNodeOptions } from '@delon/util/src/array/array.service';
import { NzTreeNode } from 'ng-zorro-antd/core';
import { MenuPermissionViewComponent } from './permission-view/menu-permission-view.component';

@Component({
  selector: 'snails-system-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {

  menuTreeNodes: NzTreeNode[] = [];
  _menuTreeNodes: NzTreeNode[] = [];

  // 点击树形菜单后，保存被点击的菜单信息
  menuSelectData = {
    menu: {
      id: '',
      title: '',
      pid: null,
      url: null,
      icon: null,
      inherit: 'no',
      description: '',
    },
    permission: [],
  };

  @ViewChild('permissionTree', { static: false }) permissionTree: NzTreeComponent;
  // 菜单权限树形结构数据
  permissionTreeNode: NzTreeNode[] = [];
  permissionExpandedKeys: string[] = [];
  permissionSelectedKeys: string[] = [];

  menuList: any[] = [];
  permissionList: any[] = [];
  personList: any[] = [];

  isMenuVisible = false;
  // modal 中填写的数据
  createMenuData_title = '';
  createMenuData_pid = null;
  createMenuData_url = null;
  createMenuData_icon = null;
  createMenuData_inherit = 'no';
  createMenuData_description = '';

  nodeOptions: ArrayServiceArrToTreeNodeOptions = { parentIdMapName: 'pid' };


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

  menuNodeOnClick(event: NzFormatEmitEvent): void {
    let data = event.node.origin;
    this.menuSelectData.menu.id = data.key;

    if (!event.node.isLeaf && event.node.isExpanded == false) {
      event.node.isExpanded = true;
      this.cdr.detectChanges();
    }

    this.http.get(`/menu/configDetail/${data.id}`).subscribe((res: any) => {

      this.message.success('数据加载成功');
      if (res.status === 0) {

        this.menuSelectData = res.data;

        let permissionList = deepCopy(this.permissionList) as any[];
        permissionList.forEach(o => {
          const item = this.menuSelectData.permission.find(w => w.target === o.id);
          if (item) {
            o['permission'] = true;
          }
        });
        this.permissionTreeNode = this.arrayService.arrToTreeNode(permissionList, this.nodeOptions);

        this.menuSelectData.permission.forEach(item => {
          let node = this.permissionTree.getTreeNodeByKey(item.target) as NzTreeNode | null;
          if (node) {
            node['permission'] = true;
          }
        });
        this.cdr.detectChanges();
      }
    }, error => {
    });
  }

  handleModalOk() {
    if (this.createMenuData_title) {
      let data = {
        title: this.createMenuData_title,
        pid: this.createMenuData_pid,
        url: this.createMenuData_url,
        icon: this.createMenuData_icon,
        inherit: this.createMenuData_inherit,
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
      this.message.warning('请填写完整菜单信息！');
    }
  }

  refresh() {
    this.emptyTreeSelect();
    this.initMenu();
  }

  edit() {
    if (!this.menuSelectData.menu.id) {
      this.message.error('请选择菜单！');
      return;
    }
    if (!this.menuSelectData.menu.title) {
      this.message.error('请填写菜单名称！');
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
      this.message.error('请选择菜单！');
    }
  }

  cancelPermission(node: NzTreeNode) {

    if (!this.menuSelectData.menu.id) {
      this.message.error('请选择菜单！');
    }

    let resource = this.menuSelectData.menu.id;
    let target = node.key;
    this.http.get(`/permission/cancel/${resource}/${target}`).subscribe((res: any) => {
      if (res.status === 0) {
        node.origin['permission'] = false;
        this.cdr.detectChanges();
        this.message.success('取消权限成功！');
      }
    }, error => {
    });
  }

  allowPermission(node: NzTreeNode) {

    if (!this.menuSelectData.menu.id) {
      this.message.error('请选择菜单！');
    }

    let resource = this.menuSelectData.menu.id;
    let target = node.key;
    this.http.get(`/permission/allow/${resource}/${target}`).subscribe((res: any) => {
      if (res.status === 0) {
        node.origin['permission'] = true;
        this.cdr.detectChanges();
        this.message.success('添加权限成功！');
      }
    }, error => {
    });
  }

  expandedNode(node: NzTreeNode, $event: MouseEvent) {

    if (!node.isLeaf && node.isExpanded == false) {
      node.isExpanded = true;
      this.cdr.detectChanges();
    }
    $event.stopPropagation();
  }

  emptyTreeSelect() {
    this.menuSelectData = {
      menu: {
        id: '',
        title: '',
        pid: null,
        url: null,
        icon: null,
        inherit: 'no',
        description: '',
      },
      permission: [],
    };
  }

  onClickCreateMenu() {
    this.createMenuData_title = '';
    this.createMenuData_pid = null;
    this.createMenuData_url = null;
    this.createMenuData_icon = null;
    this.createMenuData_inherit = 'no';
    this.createMenuData_description = '';
    this.isMenuVisible = true;
  }

  previewPersonMenu() {
    this.module.create({
      nzTitle: '预览用户菜单权限',
      nzComponentParams: {},
      nzContent: MenuPermissionViewComponent,
      nzMaskClosable: true,
      nzWidth: 900,
      nzBodyStyle: {
        padding: '10px',
        height: '600px',
      },
      nzFooter: null,
    });
  }

  private initMenu() {

    this.http.get('/menu/configData').subscribe((res: any) => {

      this.message.success('数据加载成功');

      let menudata: NzTreeNode[] = [];
      let _menudata: NzTreeNode[] = [];
      let persondata: NzTreeNode[] = [];

      if (res.status === 0) {
        menudata = res.data.menus as any[];
        _menudata = deepCopy(menudata);
        this.menuList = deepCopy(menudata);

        persondata = res.data.peoples as any[];
        this.permissionList = deepCopy(persondata);

        // list --> treeNode
        menudata = this.arrayService.arrToTreeNode(menudata, this.nodeOptions);
        _menudata = this.arrayService.arrToTreeNode(_menudata, this.nodeOptions);

        // 第一排展开
        menudata.forEach(item => item.isExpanded = true);
        _menudata.forEach(item => item.isExpanded = true);
      }
      this.menuTreeNodes = menudata;
      this._menuTreeNodes = _menudata;

      this.cdr.detectChanges();
    }, error => {
    });
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
