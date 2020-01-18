import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ArrayService } from '@delon/util';
import { ArrayServiceArrToTreeNodeOptions } from '@delon/util/src/array/array.service';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    private injector: Injector,
    iconSrv: NzIconService,
    private arrayService: ArrayService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private settingService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    let token = this.tokenService.get();
    if (token && Object.keys(token).length > 0 && token['token']) {
    } else {
      this.tokenService.set({ token: '1' });
    }
  }

  load(): Promise<any> {

    return new Promise(resolve => {
      zip(
        this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
        this.httpClient.get('/menupermission/list'),
      ).pipe(
        // 接收其他拦截器后产生的异常消息
        catchError(([langData, menuData]) => {
          resolve(null);
          return [langData, menuData];
        }),
      ).subscribe(([langData, menuData]) => {
          // setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);

          // application data
          const res: any = this.appData;
          // 应用信息：包括站点名、描述、年份
          this.settingService.setApp(res.app);
          // 用户信息：包括姓名、头像、邮箱地址
          this.settingService.setUser(res.user);
          // ACL：设置权限为全量
          this.aclService.setFull(true);
          // 设置页面标题的后缀
          this.titleService.default = '';
          this.titleService.suffix = res.app.name;
          // 初始化菜单
          this.initMenu(menuData);
        },
        () => {
        },
        () => {
          resolve(null);
        },
      );
    });
  }

  initMenu(res: any) {
    // no login
    if (401 == res.status) return;

    let data = res.data as any[];
    let menuData: any[] = [];
    let option: ArrayServiceArrToTreeNodeOptions = { parentIdMapName: 'pid' };

    data.forEach(item => {
      item['key'] = item['id'];
      item['text'] = item['title'];
      item['link'] = item['url'];
      if (item['icon']) {
        item['icon'] = 'anticon-' + item['icon'];
      }
    });
    // list --> treeNode
    data = this.arrayService.arrToTreeNode(data, option);
    data.forEach(item => menuData.push(item.origin));

    // 初始化菜单
    this.menuService.add(menuData);
    // 静态测试数据
    // this.menuService.add(this.appData.menu)
  }

  appData = {
    'app': {
      'name': 'Snails',
      'description': 'Snails framework',
    },
    'user': {
      'name': 'kuzank',
      'avatar': './assets/tmp/img/avatar.jpg',
      'email': '754109648@qq.com',
    },
    'menu': [
      {
        'text': '主导航',
        'children': [
          {
            'text': '仪表盘',
            'icon': 'anticon-dashboard',
            'children': [
              {
                'text': '仪表盘',
                'link': '/dashboard/v1',
              },
              {
                'text': '用户管理',
                'link': '/person/list',
              },
              {
                'text': '组织管理',
                'link': '/system/orgunit',
              },
              {
                'text': '菜单管理',
                'link': '/system/menu',
              },
              {
                'text': '菜单权限',
                'link': '/system/menu-permission',
              },
              {
                'text': '在线用户',
                'link': '/person/online',
              },
              {
                'text': '登陆日志',
                'link': '/person/login-list',
              },
              {
                'text': 'http请求',
                'link': '/system/httplog/list',
              },
              {
                'text': '系统异常',
                'link': '/system/exceptio/list',
              },
              {
                'text': '自定义图表',
                'link': '/dashboard/v2',
              },
            ],
          },
        ],
      },
    ],
  };

}
