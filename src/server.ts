// The most first thing you need to load the config
import dotenv from 'dotenv';
dotenv.config();

// After config, comes the application
import Express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import Compression from 'compression';
import BodyParser from 'body-parser';

export default class Server {
    public run(): void {
        // Instantiate app
        const app = Express();

        // Use gzip compression in responses
        app.use(Compression());

        // Port
        const port = process.env.LISTEN_PORT || process.env.PORT || 10000;

        // Setting up POST params parser
        app.use(Express.json());
        app.use(Express.urlencoded({
            extended: true
        }));

        // Setting up multipart/form-data
        app.use(BodyParser.raw({
            limit: '1mb',
            type: [
                'text/*',
                'application/xml',
            ],
        }));

        // RequestHandler creates a separate execution context using domains, so that every
        // transaction/span/breadcrumb is attached to its own Hub instance
        app.use(Sentry.Handlers.requestHandler());
        // TracingHandler creates a trace for every incoming request
        app.use(Sentry.Handlers.tracingHandler());

        // Dynamic middlewares registration
        const middlewares = require(process.cwd() + '/build/app/Http/Middlewares/Kernel').middlewares;
        for (const middleware of middlewares) {
            const middlewarePath = process.cwd() + '/build/app/Http/Middlewares/' + middleware + '.js';
            // At this step use require, instead of import, because it's synchronous
            const middlewareClass = require(middlewarePath);
            const middlewareInstance = new middlewareClass.default();
            app.use(middlewareInstance.handle);
        }

        // Setting up routes
        const apiRoutes = require(process.cwd() + '/build/routes/api').default;
        app.use('/', apiRoutes);

        // The error handler must be before any other error middleware and after all controllers
        app.use(Sentry.Handlers.errorHandler());

        // Exception handler
        const Handler = require(process.cwd() + '/build/app/Exceptions/Handler').default;
        app.use((error: any, request: Request, response: Response, next: NextFunction) => {
            new Handler().reportHttpException(request, response, error);
        });

        // Start the server
        app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
    }
}

const server = new Server();
server.run();
