import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ArrayService } from '@delon/util';
import { NzTreeNode } from 'ng-zorro-antd/core';
import { ArrayServiceArrToTreeNodeOptions } from '@delon/util/src/array/array.service';

@Component({
  selector: 'snails-system-menu-permission-view',
  templateUrl: './menu-permission-view.component.html',
  styleUrls: ['./menu-permission-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPermissionViewComponent implements OnInit {

  selectTargetId = '';

  menuTreeNodes: NzTreeNode[] = [];
  permissionTreeNode: NzTreeNode[] = [];

  nodeOptions: ArrayServiceArrToTreeNodeOptions = { parentIdMapName: 'pid' };

  constructor(private router: Router,
              private http: _HttpClient,
              private message: NzMessageService,
              private arrayService: ArrayService,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.initData();
  }

  expandedNode(node: NzTreeNode, $event: MouseEvent) {
    this.selectTargetId = node.key;
    if (node.icon == 'user') { // person
      this.http.get(`/menu/getByPerson/${node.key}`).subscribe((res: any) => {
        let data: NzTreeNode[] = [];
        if (res.status === 0) {
          data = res.data as any[];
          this.menuTreeNodes = this.arrayService.arrToTreeNode(data, this.nodeOptions);
          this.cdr.detectChanges();
        }
      }, error => {
      });
    } else if (node.icon == 'bank') { // orgunit
      this.http.get(`/menu/getByOrgunit/${node.key}`).subscribe((res: any) => {
        let data: NzTreeNode[] = [];
        if (res.status === 0) {
          data = res.data as any[];
          this.menuTreeNodes = this.arrayService.arrToTreeNode(data, this.nodeOptions);
          this.cdr.detectChanges();
        }
      }, error => {
      });
    } else {
      this.menuTreeNodes = [];
    }
    this.cdr.detectChanges();
  }

  private initData() {

    this.http.get('/menu/configData').subscribe((res: any) => {

      let persondata: NzTreeNode[] = [];

      if (res.status === 0) {
        persondata = res.data.peoples as any[];
        this.permissionTreeNode = this.arrayService.arrToTreeNode(persondata, this.nodeOptions);
        this.cdr.detectChanges();
      }
    }, error => {
    });
  }
}
