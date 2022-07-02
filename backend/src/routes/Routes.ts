import { Application } from 'express';

// import { check } from 'express-validator';
import { UniswapV2Controller } from '../controllers';

export default class Routes {
  public controller: UniswapV2Controller = new UniswapV2Controller();

  public routes(app: Application) {
    app.get(
      '/uniswap-history',
      [
        // check('msg')
        // check('sign')
        // check('from')
        // check('to')
      ],
      this.controller.routing,
    );
  }
}
