# 工作台PC端

## 项目结构
```
  --build                      // 项目打包的目录
      |---lib                  // 一些外部库 
      |---static               // 打包生成的静态资源
           |--- js           
           |--- css             
      |---index.html           // 打包生成入口html 
      |---index.jsp            // 服务器部署的对应页面 改成jsp 为了方便java后台 往页面内注入数据.拿到一些用户的参数
      |---status.css           // 对应public 文件中的 资源
  --config                     //一些项react项目的配置文件
  --public
      |---lib                  // 静态库 直接引入到index.html入口文件中 不参与 react项目的 编译
      |---index.html           // 入口html文件 
  --src                        // 开发目录
      |---actions              // 对应redux 中的所有action 异步操作 在action中完成
      |---ajax                 
            |---api            // 所有接口信息
            |---index.js       // 使用axios 封装的统一请求 
      |---components                 // 一些react组件                 
      |---config               // 一些开发配置文件
      |---pages                // 对应页面 这里只有 主页 和 选择应用的界面
      |---reducers             // 对应redux 中的reducer
      |---styles               // 所有的样式文件
      |---app.jsx              // 整个react的根文件
      |---index.js             // 整个项目的根文件
```
项目运行环境
=
* 开发环境 npm run start
    1. 需要启动本地的工作台服务器，
    2. 浏览器输入http://localhost:8081/plugin-workbench/index/mobile?jid=10035地址
    3. 启动项目 npm start
    4. 需要的修改的参数在public/index.html 下 全局变量 CONFIG中 cn代表人员编号
* 生成环境 npm run build 打包 到build文件夹下
    1. run build 
    2. react会把整个build文件夹删除 所以 需要找回 build中的index.jsp文件 这个文件是后台的跳转页面的文件 后台会直接访问这个页面
    3. 将新生产的 js或者css 替换到build/index.jsp对应的位置

v1.0
=
1. 小应用的展示.
2. 点击对应小应用信息 跳转到对应组件  （利用postMassage与iframe 进行交互监听跳转事件）
3. 小应用主动刷新功能，（Window对象上挂载一个 refreshPlugin方法 接收插件id cid ：plugin.audit）

待开发（优化）功能
=
1. 工作台首页响应式布局：
```
                  只有1个小应用         2个小应用                3个及以上
    列表模式：    高宽100%（占一屏）   高50%，宽100%（占一半）      占三分之一
    网格模式      高宽100%（占一屏）     高100%，宽50%            （高50%，宽50%）一页占4个
 ```

2. 不显示空应用 未配置应用：
    * 主要思路修改 原有的编辑模式 原有模式设置改为设置 模式设置放在二级菜单中 编辑 按钮也放在二级菜单中 
    * 默认首页渲染的时候 判断当该条小应用为空时 不渲染该条数据 当为编辑模式时才渲染该数据 
    * 且进入编辑模式时 所有小应用不显示内容 而是现实对应小应用组件名称 下方现实更换