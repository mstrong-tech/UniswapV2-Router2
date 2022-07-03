import { Application } from 'express';
import { check } from 'express-validator';

import { UniswapV2Controller } from '../controllers';

export default class Routes {
  public controller: UniswapV2Controller = new UniswapV2Controller();

  public routes(app: Application) {
    app.get(
      '/uniswap-history',
      [
        check('msg').exists().isString(),
        check('sign').exists().isString(),
        check('last')
          .exists()
          .isNumeric()
          .custom((v) => Number(v) > 0),
        check('size')
          .exists()
          .isNumeric()
          .custom((v) => Number(v) > 0),
      ],
      this.controller.routing,
    );
  }
}
