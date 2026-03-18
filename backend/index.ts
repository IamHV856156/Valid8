import { Hono } from 'hono';
import { cors } from 'hono/cors';
import admin from './src/routes/admin';

const app = new Hono();
app.use('/*', cors({
  origin: '*',
  allowMethods:['POST','GET','OPTIONS'],
}));

app.get('/', (c) => c.text('Valid8 API is Live!'));

app.route('/admin', admin);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};