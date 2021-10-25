import { router } from '../AppRouter';
import { Request, Response } from 'express';
import { currentUser } from '@aktickets.org/common';

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
