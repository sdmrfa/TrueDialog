import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const cors = require('cors');


dotenv.config();
const app: Express = express();
const port = 8080;

import authRoutes from './src/routes/authRoutes';
import iframRoutes from './src/routes/iframRoutes';
import webhookRoutes from './src/routes/webhookRoutes';

app.use(express.json());
app.use(express.static('public'));
app.use(cors({origin: '*'}));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, True Dialog!');
});

app.use( '/api/auth', authRoutes );
app.use( '/api/iframe', iframRoutes );
app.use( '/api/webhook', webhookRoutes );

app.listen(port, () => {
  console.log(`Server running at-- http://localhost:${port}`);
});


