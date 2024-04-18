import { Router } from 'express';
import UserController from '@/controllers/user';
import constants from '@/common/constants';

export default class UserRoute {
  private controller = new UserController();
  private route = constants.ROUTES.AUTH; // set base-route accordingly here

  constructor(private router: Router) {
    this.routes();
  }

  routes() {
    this.router.post(`${this.route}/login`, this.controller.login.bind(this.controller));
    this.router.post(`${this.route}/register`, this.controller.register.bind(this.controller));
  }
}
