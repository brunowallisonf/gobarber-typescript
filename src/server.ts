import 'reflect-metadata';

import express from 'express';

// src/server.ts
import routes from './routes';
import './database';

const app = express();
app.use(express.json());
app.use(routes);
app.listen(3333, () => {
    console.log('Server started on post 3333');
});
