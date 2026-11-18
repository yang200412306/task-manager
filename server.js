/**
 * 练习二：智能任务管理系统
 * 技术栈：Node.js + Express + Supabase（PostgreSQL）
 *
 * 本地运行：
 *   1. npm install
 *   2. 复制 .env.example 为 .env，填入 SUPABASE_URL 和 SUPABASE_ANON_KEY
 *   3. npm start  →  http://localhost:3000
 *
 * 提供的 API：
 *   GET    /api/tasks        查询全部任务（按创建时间倒序）
 *   POST   /api/tasks        新增任务  body: { title, priority }
 *   PATCH  /api/tasks/:id    切换完成状态 body: { completed }
 *   DELETE /api/tasks/:id    删除任务
 */

require('dotenv').config();

const path = require('path');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- 读取 Supabase 连接凭据 ----------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  未检测到 SUPABASE_URL / SUPABASE_ANON_KEY，请在 .env 或 Vercel 环境变量中配置。');
}

// 初始化 Supabase 客户端（凭据缺失时不创建，避免启动即崩溃）
const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// ---------- 中间件 ----------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- 接口：查询任务列表（倒序） ----------
app.get('/api/tasks', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: '数据库未配置：缺少 SUPABASE_URL / SUPABASE_ANON_KEY' });

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ---------- 接口：新增任务 ----------
app.post('/api/tasks', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: '数据库未配置' });

  const { title, priority } = req.body || {};
  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: '任务标题不能为空' });
  }

  const allowedPriority = ['高', '中', '低'];
  const finalPriority = allowedPriority.includes(priority) ? priority : '中';

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title: String(title).trim(), priority: finalPriority })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ---------- 接口：切换完成 / 未完成 ----------
app.patch('/api/tasks/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: '数据库未配置' });

  const { completed } = req.body || {};
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: Boolean(completed) })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ---------- 接口：删除任务 ----------
app.delete('/api/tasks/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: '数据库未配置' });

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

// ---------- 本地启动 / Vercel 服务端函数导出 ----------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ 任务管理系统已启动：http://localhost:${PORT}`);
  });
}

module.exports = app;
