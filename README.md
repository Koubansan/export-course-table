导出高校课程表
-----------
![license](https://img.shields.io/badge/license-GPLv3-yellowgreen.svg)

一个用于将高校的课程表导出到 iCalendar 格式（[RFC 5545](https://tools.ietf.org/html/rfc5545)）日历文件中的小书签。

导出的文件可用于导入到如 Google Calendar、Microsoft Outlook 等支持导入 iCalendar 格式日历文件的日历软件中，方便查阅。

安装&使用
-------
新建一个书签，在地址处填入下述内容，即可完成安装。

```javascript
javascript:(function(){s=document.createElement('script');s.type='text/javascript';s.src='https://cdn.jsdelivr.net/gh/stormyyd/export-course-table/dist/export-course-table.min.js';var h=document.getElementsByTagName('head')[0];h.appendChild(s);h.removeChild(s)})();
```

当位于支持的页面时，点击该书签即可导出课程表。

浏览器兼容性
----------

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| :----------------: | :---: | :---: | :--: | :---: |
| IE 10, IE 11, Edge | >= 21 | >= 23 | >= 6 | >= 15 |

注：上述表格所述为理论支持情况，不保证在过老的浏览器上正常运行。建议每位用户都使用最新版本的现代浏览器。

支持情况
------
| 学校 | 主要维护者 | 支持情况 | 备注 |
| :-: | :-: | :--------: | :--: |
| 上海大学 | [@stormyyd](https://github.com/stormyyd) | [shu.md](https://github.com/stormyyd/export-course-table/tree/master/support/shu.md) | 无 |

项目结构
------
```
.
├── COPYING                         # GPL v3.0 协议原文
├── dist                            # 发布文件目录
│   ├── export-course-table.js      # 未压缩版，用于开发环境 Debug
│   └── export-course-table.min.js  # 浏览器端执行的代码
├── README.md                       # 本文档
├── src                             # 源码目录
│    ├── bookmarklet.js             # 小书签源码
│    ├── ics.ts                     # 实现了一个极其简单的 iCalendar Writer
│    ├── main.ts                    # 主程序入口
│    ├── schools                    # 存放各学校的支持文件
│    │   ├── index.ts               # 用于 import 整个文件夹的索引文件
│    │   └── school.ts              # 所有学校的类都应该从该文件定义的抽象类中继承并实现
│    └── uuidv4.ts                  # 一个简单的 uuid 生成器
└── support                         # 存放各学校具体的支持情况
```

编译
---
```bash
$ git clone https://github.com/stormyyd/export-course-table.git
$ cd export-course-table
$ yarn install
$ yarn build            # 编译生成 ./dist/export-course-table.js
$ yarn build-release    # 编译生成 ./dist/export-course-table.min.js
```

License
-------
![GNU General Public License v3.0](https://www.gnu.org/graphics/gplv3-with-text-136x68.png)

[GNU General Public License v3.0 or later](https://github.com/stormyyd/export-course-table/COPYING)

贡献代码
-------
//惊了，居然有人想贡献代码

首先，请知悉，本项目使用的协议为 GPL v3.0 协议。这意味着所有您贡献的代码均会以该协议释出。如若不能接受该协议所述内容，请不要贡献任何代码。

其次，项目仅接受采用 TypeScript 编写的代码，不接受任何纯 JavaScript 的代码。

最后，请尽量不要引入任何非开发环境的依赖。个人认为引入依赖可能会使代码大小迅速膨胀，影响加载速度。所以，如无必要，请不要引入任何非开发环境的依赖。
