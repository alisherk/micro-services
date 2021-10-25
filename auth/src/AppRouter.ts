import express, { IRouter } from 'express';

class AppRouter {
  private static instance: IRouter;

  public static getInstance() {
    if (!AppRouter.instance) {
      AppRouter.instance = express.Router();
    }
    return AppRouter.instance;
  }
}

export const router = AppRouter.getInstance();
