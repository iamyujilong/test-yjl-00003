# 二手车交易企业 SaaS 后台

一个专为二手车交易企业设计的 SaaS 管理后台系统，涵盖采购、订单、物流仓储、财务结算等核心业务流程，并预留广告平台对接接口用于兴趣用户数据转化跟踪。

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 5
- TailwindCSS 3
- React Router DOM 6
- Zustand (状态管理)
- Lucide React (图标)

### 后端
- Express 4 + TypeScript
- SQLite 3 (数据库)
- bcryptjs (密码加密，纯JS实现，无需编译)
- jsonwebtoken (身份认证)
- CORS (跨域)

## 功能模块

### 1. 首页工作台
- 今日订单量统计
- 在途车辆数统计
- 待结算金额统计
- 库存周转率展示
- 待办提醒列表

### 2. 订单管理
- **采购订单**: 创建、审核、状态跟踪（待付款、已付款、运输中、已交付、已完成）
- **销售订单**: 完整销售流程管理
- **异常订单**: 单独处理异常订单

### 3. 物流仓储
- **入库登记**: 车辆入库表单
- **库位分配**: 仓库库位可视化管理
- **库存盘点**: 库存车辆列表查询
- **出库管理**: 车辆出库确认流程
- **在途跟踪**: 实时运输轨迹查看

### 4. 结算管理
- **采购付款**: 待付款/已付款统计
- **销售收款**: 收款记录管理
- **佣金计算**: 销售佣金自动计算
- **发票管理**: 发票上传与审核
- **对账单**: 按供应商/客户维度生成

### 5. 基础资料
- **车源信息**: 品牌、车型、车系、年款、VIN码管理
- **客户信息**: 个人/企业客户管理
- **供应商**: 车源供应商管理
- **仓库管理**: 仓库及库位使用率统计
- **系统用户**: 用户权限管理

### 6. 开放 API (广告平台对接)
- 连通性测试接口
- 客户线索推送接口
- 转化跟踪接口

## 项目结构

```
used-car-saas/
├── api/                    # 后端代码
│   ├── server.ts           # Express 服务器入口
│   ├── database.ts         # SQLite 数据库初始化与模型
│   ├── routes/             # API 路由
│   │   ├── auth.ts         # 认证路由
│   │   ├── orders.ts       # 订单路由
│   │   ├── warehouse.ts    # 仓储路由
│   │   ├── settlement.ts   # 结算路由
│   │   └── master.ts       # 基础资料路由
│   └── tsconfig.json       # 后端 TypeScript 配置
├── src/                    # 前端代码
│   ├── components/         # 公共组件
│   │   ├── Sidebar.tsx     # 侧边导航
│   │   ├── Header.tsx      # 顶部导航
│   │   └── Layout.tsx      # 页面布局
│   ├── pages/              # 页面组件
│   │   ├── Login.tsx       # 登录页
│   │   ├── Dashboard.tsx   # 首页工作台
│   │   ├── PurchaseOrders.tsx    # 采购订单
│   │   ├── SalesOrders.tsx       # 销售订单
│   │   ├── AbnormalOrders.tsx    # 异常订单
│   │   ├── WarehouseInbound.tsx  # 入库登记
│   │   ├── WarehouseAlloc.tsx    # 库位分配
│   │   ├── WarehouseInventory.tsx# 库存盘点
│   │   ├── WarehouseOutbound.tsx # 出库管理
│   │   ├── WarehouseTracking.tsx # 在途跟踪
│   │   ├── SettlementPurchase.tsx # 采购付款
│   │   ├── SettlementSales.tsx   # 销售收款
│   │   ├── SettlementCommission.tsx # 佣金结算
│   │   ├── SettlementInvoice.tsx # 发票管理
│   │   ├── SettlementStatement.tsx # 对账单
│   │   ├── MasterCar.tsx   # 车源信息
│   │   ├── MasterCustomer.tsx    # 客户信息
│   │   ├── MasterSupplier.tsx    # 供应商管理
│   │   ├── MasterWarehouse.tsx   # 仓库管理
│   │   ├── MasterUser.tsx   # 系统用户
│   │   └── OpenApiTest.tsx  # API测试页
│   ├── api.ts              # API 客户端封装
│   ├── store.ts            # Zustand 状态管理
│   ├── App.tsx             # 路由配置
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── data/                   # 数据库文件 (运行时自动生成)
│   └── database.db         # SQLite 数据库文件
├── package.json            # 项目依赖
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # TailwindCSS 配置
├── postcss.config.js       # PostCSS 配置
└── tsconfig.json           # 前端 TypeScript 配置
```

## 环境要求

- **Node.js**: >= 18.x (推荐使用 Node.js v20+，已验证支持 Node.js v26)
- **npm**: >= 9.x
- **操作系统**: Windows / macOS / Linux

> **注意**: 本项目使用 `bcryptjs` 替代原生 `bcrypt`，原因是原生 `bcrypt` 在 Node.js v26 环境下可能存在编译问题。`bcryptjs` 是纯 JavaScript 实现，无需编译，兼容性更好。

## 安装与运行

### 1. 克隆项目

```bash
git clone <项目仓库地址>
cd used-car-saas
```

### 2. 安装依赖

```bash
# 安装所有依赖
npm install
```

> **常见问题**: 如果 `npm install` 失败，请检查：
> - Node.js 是否已正确安装：`node -v`
> - npm 是否已正确安装：`npm -v`
> - 网络连接是否正常
> - 尝试切换 npm 镜像源：`npm config set registry https://registry.npmmirror.com`

### 3. 启动开发服务器

```bash
# 启动后端服务（端口 3000）
npm run dev:server

# 在另一个终端启动前端开发服务器（端口 5173）
npm run dev:client
```

### 4. 访问应用

- 前端地址: http://localhost:5173
- 后端 API: http://localhost:3000/api

### 5. 构建生产版本

```bash
# 构建前端
npm run build:client

# 构建后端
npm run build:server

# 启动生产服务
npm start
```

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |

## API 接口说明

### 认证接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户信息 |
| POST | /api/auth/logout | 用户登出 |

### 订单接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/orders/purchase | 获取采购订单列表 |
| POST | /api/orders/purchase | 创建采购订单 |
| GET | /api/orders/purchase/:id | 获取采购订单详情 |
| PUT | /api/orders/purchase/:id/status | 更新采购订单状态 |
| GET | /api/orders/sales | 获取销售订单列表 |
| POST | /api/orders/sales | 创建销售订单 |
| GET | /api/orders/sales/:id | 获取销售订单详情 |
| PUT | /api/orders/sales/:id/status | 更新销售订单状态 |
| GET | /api/orders/abnormal | 获取异常订单列表 |
| PUT | /api/orders/abnormal/:id/handle | 处理异常订单 |

### 仓储接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/warehouse/inbound | 车辆入库 |
| GET | /api/warehouse/inbound | 获取入库记录 |
| POST | /api/warehouse/alloc | 库位分配 |
| GET | /api/warehouse/locations | 获取库位列表 |
| GET | /api/warehouse/inventory | 获取库存列表 |
| POST | /api/warehouse/outbound | 车辆出库 |
| GET | /api/warehouse/tracking/:orderId | 获取运输轨迹 |

### 结算接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/settlement/purchase | 采购付款记录 |
| POST | /api/settlement/purchase | 创建采购付款 |
| GET | /api/settlement/sales | 销售收款记录 |
| POST | /api/settlement/sales | 创建销售收款 |
| GET | /api/settlement/service | 服务费结算记录 |
| POST | /api/settlement/service | 创建服务费结算 |
| GET | /api/settlement/commission | 佣金记录 |
| POST | /api/settlement/commission | 创建佣金记录 |
| GET | /api/settlement/invoice | 发票记录 |
| POST | /api/settlement/invoice | 创建发票 |
| GET | /api/settlement/statement?type=supplier\|customer | 对账单 |

### 基础资料接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/master/car-brands | 获取品牌列表 |
| POST | /api/master/car-brands | 创建品牌 |
| GET | /api/master/car-models | 获取车型列表 |
| POST | /api/master/car-models | 创建车型 |
| GET | /api/master/car-series | 获取车系列表 |
| POST | /api/master/car-series | 创建车系 |
| GET | /api/master/cars | 获取车辆列表 |
| POST | /api/master/cars | 创建车辆 |
| GET | /api/master/customers | 获取客户列表 |
| POST | /api/master/customers | 创建客户 |
| GET | /api/master/suppliers | 获取供应商列表 |
| POST | /api/master/suppliers | 创建供应商 |
| GET | /api/master/warehouses | 获取仓库列表 |
| POST | /api/master/warehouses | 创建仓库 |
| GET | /api/master/users | 获取用户列表 |
| POST | /api/master/users | 创建用户 |

### 开放 API (广告平台对接)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/open/test | 连通性测试 |
| POST | /api/open/lead | 客户线索推送 |
| GET | /api/open/lead/:id | 获取线索详情 |
| PUT | /api/open/lead/:id/status | 更新线索状态 |

## 数据库说明

本系统使用 SQLite 数据库，首次运行时会自动创建数据库文件和表结构，并插入初始测试数据。

- 数据库文件路径: `data/database.db`
- 数据库连接保持打开状态，服务运行期间不会关闭
- 使用 `INSERT OR IGNORE` 确保初始数据不会重复插入
- 管理员密码使用 `bcryptjs` 加密存储

### 数据库初始化逻辑

数据库初始化流程如下：
1. 应用启动时创建 SQLite 数据库连接
2. 调用 `initDatabase()` 执行建表和初始数据插入
3. 数据库连接在服务运行期间保持打开状态
4. 只有在进程退出时才会关闭数据库连接

**注意**: `database.ts` 中不会调用 `db.close()`，因为数据库连接需要在服务运行期间保持打开状态。如果在 `initDatabase()` 后调用 `db.close()`，会导致后续所有数据库操作失败。

## API 测试

### 使用 curl 测试

```bash
# 测试连通性
curl http://localhost:3000/api/open/test

# 用户登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 获取采购订单列表
curl http://localhost:3000/api/orders/purchase

# 推送客户线索
curl -X POST http://localhost:3000/api/open/lead \
  -H "Content-Type: application/json" \
  -d '{"source":"抖音","phone":"13700137001","name":"张三","car_info":"宝马3系"}'
```

### 使用前端测试页

访问 http://localhost:5173/api/test 可以使用可视化界面测试 API。

## 开发注意事项

### 端口配置
- 后端默认端口: 3000
- 前端默认端口: 5173
- 如果端口被占用，可以修改 `api/server.ts` 和 `vite.config.ts` 中的端口配置

### API 代理
- 前端开发环境通过 Vite 代理将 `/api` 请求转发到后端
- 代理配置在 `vite.config.ts` 中

### 密码加密
- 使用 `bcryptjs` 进行密码加密，避免原生 `bcrypt` 的编译问题
- 密码验证使用 `bcrypt.compare()`

### 静态文件
- 生产环境下前端构建产物通过后端静态服务提供

## 常见问题排查

### 问题 1: npm 找不到文件路径

**现象**: 执行 `npm run dev:server` 时报错 "Cannot find module" 或 "ENOENT: no such file or directory"

**原因**: npm 脚本执行时工作目录不正确

**解决方案**:
```bash
# 确保在项目根目录下执行
cd "e:\AI Coding\test-yjl-00003"
npm run dev:server
```

### 问题 2: 端口没有监听

**现象**: 启动后看不到 "Server running on http://localhost:3000" 日志，端口 3000 没有被监听

**可能原因**:
1. 数据库初始化失败
2. 依赖安装不完整
3. Node.js 版本不兼容
4. ts-node 编译失败

**排查步骤**:
```bash
# 查看启动日志（重点关注 Error 信息）
npm run dev:server

# 检查数据库文件是否创建
ls data/database.db

# 检查端口占用
netstat -ano | findstr :3000

# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: db.get() 或 db.all() 调用失败

**现象**: 日志中出现大量 "SQLITE_ERROR: no such table" 或 "database is locked" 错误

**可能原因**:
1. 数据库目录不存在
2. 数据库文件权限问题
3. 数据库连接在初始化完成前被使用

**解决方案**:
- 确保 `data/` 目录存在且有读写权限
- 检查 `api/database.ts` 中是否在 `db.serialize()` 完成前调用了 `resolve()`
- 删除旧的数据库文件重新初始化：
```bash
rm data/database.db
npm run dev:server
```

### 问题 4: 登录失败（用户名或密码错误）

**现象**: 使用 admin/admin123 登录时提示"用户名或密码错误"

**原因**: 数据库中存储的密码哈希与 bcryptjs 不兼容

**解决方案**:
1. 删除旧的数据库文件重新初始化：
```bash
rm data/database.db
npm run dev:server
```
2. 首次启动时系统会使用 bcryptjs 重新生成密码哈希

### 问题 5: bcrypt 编译失败（Node.js v26）

**现象**: `npm install` 时出现 bcrypt 相关的编译错误

**原因**: 原生 `bcrypt` 需要编译，在某些 Node.js 版本下可能失败

**解决方案**:
- 本项目已使用 `bcryptjs` 替代原生 `bcrypt`
- `bcryptjs` 是纯 JavaScript 实现，无需编译
- 如果仍有问题，删除 node_modules 重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

### 问题 6: 数据库操作失败（database is locked）

**现象**: 数据库操作返回 "SQLITE_BUSY: database is locked"

**原因**: SQLite 是文件级锁，多个进程或连接同时访问会导致锁冲突

**解决方案**:
1. 确保只有一个后端进程在运行
2. 检查是否有其他程序打开了数据库文件
3. 重启服务：
```bash
# Windows
taskkill /F /IM node.exe
npm run dev:server

# Linux/macOS
killall node
npm run dev:server
```

### 问题 7: ts-node 编译错误

**现象**: 启动时报 TypeScript 编译错误

**原因**: TypeScript 配置问题或代码语法错误

**解决方案**:
```bash
# 检查 TypeScript 配置
cat api/tsconfig.json

# 运行类型检查
npm run check

# 如果是模块导入问题，确保 esModuleInterop 已启用
```

### 问题 8: 前端页面无法访问

**现象**: 前端页面白屏或显示连接错误

**可能原因**:
1. 后端服务未启动
2. 端口配置不一致
3. CORS 配置问题

**排查步骤**:
```bash
# 检查后端是否启动
curl http://localhost:3000/health

# 检查前端代理配置
cat vite.config.ts

# 确保后端在前端启动前启动
```

## 启动流程说明

后端启动流程如下：
1. 创建 Express 应用实例
2. 创建 `data/` 目录（如果不存在）
3. 创建 SQLite 数据库连接
4. 调用 `initDatabase()` 执行建表和初始数据插入
5. 注册所有路由
6. 启动 HTTP 服务

**关键日志**:
```
Connected to SQLite database    # 数据库连接成功
Database initialization completed  # 数据库初始化完成
Registering routes...           # 路由注册开始
Server running on http://localhost:3000  # 服务启动成功
```

如果在 "Connected to SQLite database" 之后没有看到 "Database initialization completed"，说明数据库初始化失败，请检查日志中的错误信息。

## 快速验证清单

启动后执行以下命令验证服务是否正常：

```bash
# 1. 健康检查
curl http://localhost:3000/health
# 预期输出: {"status":"ok","timestamp":"..."}

# 2. 开放 API 测试
curl http://localhost:3000/api/open/test
# 预期输出: {"status":"ok","message":"广告平台对接 API 测试成功",...}

# 3. 用户登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# 预期输出: {"status":"ok","data":{"id":1,"username":"admin",...,"token":"..."}}

# 4. 获取采购订单列表
curl http://localhost:3000/api/orders/purchase
# 预期输出: {"status":"ok","data":[...]}

# 5. 获取车源品牌列表
curl http://localhost:3000/api/master/car-brands
# 预期输出: {"status":"ok","data":[...]}
```

如果以上所有命令都返回 `status: "ok"`，说明服务正常运行。

### 健康检查接口说明

健康检查接口 `/health` 会检查数据库初始化状态：

- **数据库未就绪**：返回 HTTP 503，`{"status":"unhealthy","message":"Database initialization in progress"}`
- **数据库已就绪**：返回 HTTP 200，`{"status":"ok"}`

此接口可用于容器编排（如 Docker、Kubernetes）的健康探测，确保服务在数据库初始化完成后才对外提供服务。

### 事务保护

订单创建操作（采购订单和销售订单）采用 SQLite 事务机制：

1. **BEGIN TRANSACTION**：开始事务
2. **INSERT INTO orders**：插入订单主表
3. **INSERT INTO order_items**：插入订单明细（支持多条）
4. **COMMIT**：提交事务
5. **ROLLBACK**：任一步骤失败时回滚所有操作

事务保护确保订单数据的一致性，避免出现"只有订单主表记录但没有明细"的情况。

## 项目维护

### 添加新功能模块

1. 在 `api/routes/` 目录下创建新的路由文件
2. 在 `api/server.ts` 中引入并注册新路由
3. 在 `src/pages/` 目录下创建新的页面组件
4. 在 `src/App.tsx` 中添加路由配置
5. 在 `src/api.ts` 中添加 API 调用方法

### 数据库迁移

1. 在 `api/database.ts` 中添加新的表结构或字段
2. 使用 `CREATE TABLE IF NOT EXISTS` 确保兼容性
3. 使用 `INSERT OR IGNORE` 或 `INSERT OR REPLACE` 插入初始数据

### 部署到生产环境

```bash
# 构建项目
npm run build:client
npm run build:server

# 启动生产服务
npm start

# 或者使用 PM2 管理进程
pm2 start dist/server.js --name used-car-saas
```

## License

MIT License
