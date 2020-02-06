import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import { ArrayService } from '@delon/util';
import { ArrayServiceArrToTreeNodeOptions } from '@delon/util/src/array/array.service';
import { NzTreeNode } from 'ng-zorro-antd/core';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'snails-system-selectitem',
  templateUrl: './selectitem.component.html',
  styleUrls: ['./selectitem.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectitemComponent implements OnInit {

  dataOnLoading = false;
  curnode;
  nodes: NzTreeNode[] = [];

  nzScroll = { x: '100%', y: '300px' };
  listOfData = [];

  nodeOptions: ArrayServiceArrToTreeNodeOptions = { parentIdMapName: 'pid' };


  constructor(private http: _HttpClient,
              private message: NzMessageService,
              private arrayService: ArrayService,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {

    this.initData();
  }


  nzEvent(event: NzFormatEmitEvent) {
    if (event.eventName == 'expand') {
    }
    if (event.eventName == 'click') {
      event.node.isExpanded = true;
      const node = event.node;
      this.curnode = node;
      this.dataOnLoading = true;
      this.getByPid(node.key).then(res => {
        this.listOfData = res;

        this.dataOnLoading = false;
        this.cdr.detectChanges();
      });
    }
  }

  getByPid(pid): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(`/selectitem/findByPid/${pid}`, {}).subscribe(res => {
        if (res.data)
          resolve(res.data);
        else {
          resolve([]);
        }
      });
    });
  }

  save() {
    if (!this.curnode) {
      this.message.error('请选择枚举！');
      return;
    }
    this.dataOnLoading = true;
    this.http.post(`/selectitem/saveAll/${this.curnode.key}`, this.listOfData).subscribe(res => {
      this.dataOnLoading = false;
      if (res.data) {
        this.message.success('保存成功！');
        this.initData();
      } else {
        this.message.error('保存失败！');
      }
    });
  }

  additem() {
    if (!this.curnode) {
      this.message.error('请选择枚举！');
      return;
    }
    var newid = UUID.UUID().replace(/-/g, '').toLocaleLowerCase();
    var newitem = {
      id: newid,
      key: newid,
      pid: this.curnode.key,
      idpath: this.curnode.origin.idpath + ',' + newid,
      enable: 'yes',
    };
    this.listOfData = [...this.listOfData, newitem];
    console.log(this.listOfData);

    this.cdr.detectChanges();
  }

  delete(id: any) {
    this.dataOnLoading = true;
    this.http.post(`/selectitem/deleteById/${id}`).subscribe(res => {
      this.dataOnLoading = false;
      if (res.data) {
        this.message.success('删除成功！');
        this.listOfData = this.listOfData.filter(item => item.id !== id);
        this.cdr.detectChanges();
      } else {
        this.message.error('删除失败！');
      }
    });
  }

  private initData() {
    this.dataOnLoading = true;
    this.http.get(`/selectitem/findAll`).subscribe(res => {
      let data = res.data as [];
      this.nodes = this.arrayService.arrToTreeNode(data, this.nodeOptions);
      this.nodes.forEach(item => item.isExpanded = true);

      this.dataOnLoading = false;
      this.cdr.detectChanges();
    });
  }
}
