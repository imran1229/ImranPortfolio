import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] as string || randomUUID(),
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "../../portfolio/dist");
app.use(express.static(staticPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"), (err) => { if (err && !res.headersSent) res.status(500).json({ error: 'Internal server error' }); });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => { logger.error({ err }, 'Unhandled error'); res.status(500).json({ error: 'Internal server error' }); });

export default app;
