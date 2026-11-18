# 练习二：智能任务管理系统（Node.js Express + Supabase）

## 一、功能与最终效果

- 顶部输入框写任务标题，下拉框选优先级（高 / 中 / 低），点击“添加”入库；
- 任务列表按创建时间倒序显示（最新在最上面）；
- 每条任务显示：标题、优先级标签、完成状态、创建时间；
- 每条任务有“完成 / 未完成”切换按钮和“删除”按钮；
- 顶部可按优先级筛选：全部 / 高 / 中 / 低；
- 已完成任务文字自动加删除线、颜色变淡；
- 关掉浏览器再打开，数据仍保存在 Supabase 云端数据库；
- 最终部署到 Vercel，得到一个 `https://xxx.vercel.app` 公网网址。

## 二、项目结构

```
task-manager/
├── server.js              # Node.js + Express 服务器（提供 API + 托管页面）
├── package.json            # 项目依赖清单
├── vercel.json             # Vercel 部署路由配置
├── .env.example            # 环境变量示例（复制为 .env 后填写）
├── .gitignore              # 忽略 node_modules / .env 等
├── sql/
│   └── schema.sql          # 建表 SQL + RLS 访问策略
└── public/
    └── index.html         # 前端页面（浏览器里看到的界面）
```

## 三、准备账号

| 平台 | 地址 | 作用 | 是否免费 |
| --- | --- | --- | --- |
| 豆包（AI 助手） | https://www.doubao.com | 生成 / 改造代码 | 免费 |
| Supabase | https://supabase.com | 云端 PostgreSQL 数据库 | 免费 |
| GitHub | https://github.com | 存放代码、版本管理 | 免费 |
| Vercel | https://vercel.com | 部署上线 | 免费 |

> 后三个平台都可用 GitHub 账号一键登录。

## 四、第一步：创建 Supabase 项目与数据表

### 4.1 新建项目

1. 登录 https://supabase.com ，点击 `New Project`；
2. 填写：
   - Name：`task-manager-你的名字`
   - Database Password：点击 `Generate` 生成并保存好
   - Region：选 `Southeast Asia (Singapore)`（新加坡，国内访问最快）
3. 点击 `Create`，等待 1～2 分钟状态变为 `Active`。

### 4.2 建表并配置 RLS

进入项目左侧 `SQL Editor`（闪电图标）→ `New query`，把 `sql/schema.sql` 中的内容完整粘贴进去，点击 `Run`。

看到 `Success. No rows returned` 即成功。

`tasks` 表结构：

| 字段 | 类型 | 作用 |
| --- | --- | --- |
| id | bigint 自增主键 | 任务唯一编号 |
| title | text | 任务标题 |
| priority | text，只能是 高 / 中 / 低 | 优先级 |
| completed | boolean，默认 false | 是否完成 |
| created_at | timestamptz，默认当前时间 | 创建时间（用来倒序） |

### 4.3 获取连接凭据

左侧点击齿轮图标 `Project Settings` → `API Keys`（或顶部 `Connect` → `App Frameworks`），复制两项：

- **Project URL**：形如 `https://xxxxxxxx.supabase.co`
- **Publishable key**：形如 `sb_publishable_xxxxxxxx`

> ⚠️ 旁边以 `sb_secret_...` 开头的是保密密钥，不要复制、不要发给别人、不要传到 GitHub。

## 五、第二步：本地跑通

### 5.1 安装依赖

```bash
cd task-manager
npm install
```

### 5.2 填写环境变量

复制 `.env.example` 为 `.env`：

```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

编辑 `.env`，填入 4.3 节拿到的凭据：

```env
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY=sb_publishable_xxxxxxxx
```

### 5.3 启动服务

```bash
npm start
# 等价于：node server.js
```

浏览器访问：

```
http://localhost:3000
```

在页面上测试：添加任务、切换完成状态、删除、按优先级筛选；关掉浏览器重新打开，数据还在即全链路打通。

## 六、第三步：推送到 GitHub

1. 在 GitHub 右上角 `+` → `New repository`：
   - Repository name：`task-manager-你的名字`
   - 选 `Public`
   - **不要**勾选 `Add a README file`
   - 点击 `Create repository`
2. 在本地项目目录执行（替换成你自己的仓库地址）：

```bash
git init
git add .
git commit -m "init: 智能任务管理系统"
git branch -M main
git remote add origin https://github.com/你的用户名/task-manager-你的名字.git
git push -u origin main
```

> 注意：`.env` 已在 `.gitignore` 中，**不会**被提交到 GitHub。

## 七、第四步：Vercel 部署上线

1. 登录 https://vercel.com ，点击 `Add New` → `Project`；
2. 在仓库列表找到 `task-manager-你的名字`，点击 `Import`；
3. Framework 选 `Other`，确认能识别为 Node 项目；
4. 在 `Environment Variables` 区域逐条添加（变量名不要改）：

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | 4.3 节拿到的 Project URL |
   | `SUPABASE_ANON_KEY` | 4.3 节拿到的 Publishable key |

5. 点击 `Deploy`，等待 1～3 分钟；
6. 获得 `https://task-manager-xxx.vercel.app` 网址。

✅ 达成标志：在 Vercel 网址上加一条任务，回到 Supabase 的 `Table Editor` 能看到这条新数据；不同设备打开都能看到同一份数据。

## 八、完整验证清单

- [ ] 本地页面能添加、完成、删除、筛选任务
- [ ] Supabase 左侧 `Table Editor` 能看到 `tasks` 表及数据
- [ ] GitHub 仓库页面能看到完整代码
- [ ] `.env` 文件**没有**出现在 GitHub 仓库里
- [ ] Vercel 给的 `.vercel.app` 网址能正常打开
- [ ] 在 Vercel 网址上加任务，Supabase 后台能看到新数据
- [ ] 关掉浏览器再打开 Vercel 网址，数据还在

## 九、常见问题排查（FAQ）

**Q1：点添加任务报错 `new row violates row-level security policy`**
RLS 策略没开全。回到 4.2 节，把 `schema.sql` 中四条 `create policy` 语句重新跑一遍。

**Q2：报错 `relation "tasks" does not exist`**
表没建成功。回到 4.2 节重跑建表 SQL，或在 `Table Editor` 里确认表是否存在。

**Q3：`git push` 报错 `Permission denied` 或要求输入密码**
GitHub 2021 年后不再支持账号密码 push：HTTPS 方式在弹窗中授权登录，或生成 SSH key 配置到 GitHub 账号。

**Q4：不小心把 `.env` 和 key 传到了 GitHub**
立刻：去 Supabase 后台 `API Keys` 页面轮换（rotate）该密钥生成新的；本地删掉 `.env`，重新 commit 并 push；以后 `.env` 必须留在 `.gitignore` 里。

**Q5：Vercel 部署失败 / 打开网址报错**
进入 Vercel 项目 `Deployments`，点最新一次部署查看 `Build Logs` 红色报错。最常见原因是环境变量没配全或变量名拼错；改完环境变量后记得 `Redeploy`。

**Q6：本地能看到数据，Vercel 网址上看不到**
两边连的不是同一个 Supabase 项目。核对 Vercel 里 `SUPABASE_URL` 的项目 ID，与浏览器地址栏 Supabase 后台的项目 ID 是否一致。

**Q7：Supabase 提示旧 anon key 要弃用**
旧版 `eyJ...` JWT key 停用后，去 `Project Settings → API Keys` 复制新的 `sb_publishable_...`，替换本地 `.env` 和 Vercel 环境变量即可，代码不用改。

## 十、可复用提示词（供后续向 AI 提问）

**提示词一：生成应用**

```
请使用 nodejs + supabase 数据库开发一个智能任务管理系统，要求：
1. 功能：输入框 + 优先级下拉（高/中/低）添加任务；任务列表显示标题、优先级、完成状态；每条任务有“完成/未完成”切换按钮和“删除”按钮；按优先级筛选（全部/高/中/低）；
2. 页面要求：中文界面，简洁美观，任务按创建时间倒序显示，已完成的任务加删除线。
```

**提示词二：切换到自己的 Supabase**

```
请把这个应用的后端数据层切换到我自己的 Supabase 项目：
SUPABASE_URL = https://你的项目ID.supabase.co
SUPABASE_ANON_KEY = sb_publishable_你的key
要求：后端使用 @supabase/supabase-js 通过 REST API 访问 tasks 表，保持前端功能不变。
```

## 十一、课后拓展

- 给任务加“截止日期”字段，逾期任务标红；
- 加搜索框，按标题模糊搜索；
- 加统计面板：共多少条、完成多少条、高优先级剩几条；
- 把 RLS 策略改成“登录用户只能看自己的任务”（接入 Supabase Auth）；
- 在 Vercel 上绑定自己的域名；
- 改一行代码 push 到 GitHub，观察 Vercel 自动重新部署。
