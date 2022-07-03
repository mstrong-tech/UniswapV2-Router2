import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { Routes } from './routes';

class App {
  public app: express.Application = express();
  public route: Routes = new Routes();

  constructor() {
    this.config();
    this.route.routes(this.app);
  }

  private config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static('public'));
    this.app.options('*', cors);
    this.app.use(cors());
  }
}

export default new App().app;
