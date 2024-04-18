import { Router } from 'express';
import SwaggerDocsRoute from '@/routes/swagger/swagger';
import UserRoute from '@/routes/user/user';

export default class AppRouter {
  public router = Router();

  constructor() {
    this.routes();
  }

  private routes() {
    new SwaggerDocsRoute(this.router);
    new UserRoute(this.router);
  }
}
