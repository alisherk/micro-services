import { router } from '../AppRouter';
import { Request, Response } from 'express';

router.post('/api/users/signout', (req: Request, res: Response) => {
    req.session = null;
    res.send({})
});

export { router as signoutRouter };