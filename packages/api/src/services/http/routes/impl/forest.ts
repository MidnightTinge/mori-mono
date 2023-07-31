import IRoute from '../IRoute';
import {NextFunction, Request, Response, Router} from 'express';
import {RequireAuth} from '../../middleware/Authenticate';
import Forest, {IForest} from '../../../database/models/Forest';
import Database from '../../../database';
import CodedError from '../../../../utils/CodedError';
import Tree, {ITree} from '../../../database/models/Tree';
import RequireBody from '../../middleware/RequireBody';
import {fromScope, toVoid} from '@mori-app/functions';

export default {
  root: '/forest',
  router(grid) {
    const router = Router();
    router.use(RequireAuth());

    router.route('/')
      .get((req: Request, res: Response) => {
        res.fromNullablePromise(
          Forest.findAll({
            where: {
              owner: req.session.user.id,
            },
          }).then(Database.safeUnwrapAll),
        );
      })
      .post(RequireBody, (req: Request, res: Response) => {
        const {name, description} = req.body;
        if (!name) {
          return res.c400();
        }

        return res.fromPromise(
          Forest.create({
            name,
            description,
            owner: req.session.user.id,
          })
            .then(Database.safeUnwrap),
        );
      });

    router.route('/:forestId')
      .all(attachForest)
      .get((req: Request, res: Response) => {
        return res.ok(res.locals.forest);
      })
      .patch(RequireBody, (req: Request, res: Response) => {
        const {name, description} = req.body;

        if (!name && !description) {
          return res.c400();
        }

        const update: Partial<IForest> = {
          ...res.locals.forest,
        };
        if (name) {
          update.name = name;
        }

        if (description) {
          update.description = description;
        }

        return res.fromPromise(
          Forest.update(update, {
            where: {
              id: res.locals.forest.id,
            },
          }).then(fromScope(update)),
        );
      })
      .delete((req: Request, res: Response) => {
        return res.fromVoidPromise(
          Forest.destroy({
            where: {
              id: res.locals.forest.id,
            },
          }).then(toVoid),
        );
      });

    router.route('/:forestId/trees')
      .all(attachForest)
      .get((req: Request, res: Response) => {
        return res.fromNullablePromise(
          Tree.findAll({
            where: {
              forest: res.locals.forest.id,
            },
          }),
        );
      })
      .post(RequireBody, (req: Request, res: Response) => {
        const {content} = req.body;

        if (!content) {
          return res.c400();
        }

        return res.fromPromise(
          Tree.create({
            content,
            forest: res.locals.forest.id,
          }).then(Database.safeUnwrap),
        );
      });

    router.route('/:forestId/trees/:treeId')
      .all(attachForest, attachTree)
      .get((req: Request, res: Response) => {
        return res.ok(res.locals.tree);
      })
      .patch(RequireBody, (req: Request, res: Response) => {
        const {content} = req.body;

        if (!content) {
          return res.c400();
        }

        // note that moving forests is its own endpoint (NYI)
        const update: Partial<ITree> = {
          ...res.locals.tree,
          content,
        };

        return res.fromPromise(
          Tree.update(update, {
            where: {
              id: res.locals.tree.id,
            },
          }).then(fromScope(update)),
        );
      })
      .delete((req: Request, res: Response) => {
        return res.fromVoidPromise(
          Tree.destroy({
            where: {
              id: res.locals.tree.id,
            },
          }).then(toVoid),
        );
      });

    /**
     * Attaches a forest to the request. A forest will only be attached when:
     *   - it exists
     *   - it is owned by the current user
     *   - it is not deleted
     */
    function attachForest(req: Request, res: Response, next: NextFunction) {
      Forest.findOne({
        where: {
          id: req.params.forestId,
          owner: req.session.user.id,
        },
      })
        .then(Database.safeUnwrap)
        .then(forest => {
          res.locals.forest = forest;
          next();
        })
        .catch(err => {
          if (CodedError.is(err, CodedError.GENERIC.notFound)) {
            return res.c404();
          }

          next(err);
        });
    }

    /**
     * Attaches a tree to the request. Since trees have no "owner" other than
     * the forest they're attached to, one must first attach a forest to the
     * request before attempting to attach a tree. This has the added benefit of
     * ensuring that the forest is owned by the current user before reading the
     * tree.
     */
    function attachTree(req: Request, res: Response, next: NextFunction) {
      if (!res.locals.forest) {
        return res.c404();
      }

      // `forest` will only be set when:
      //   - it exists
      //   - it is owned by the current user
      //   - it is not deleted
      // so trusting `res.locals.forest` is safe.
      Tree.findOne({
        where: {
          id: req.params.treeId,
          forest: req.params.forestId,
        },
      })
        .then(Database.safeUnwrap)
        .then(tree => {
          res.locals.tree = tree;
          next();
        })
        .catch(err => {
          if (CodedError.is(err, CodedError.GENERIC.notFound)) {
            return res.c404();
          }

          next(err);
        });
    }

    return router;
  },
} satisfies IRoute;
