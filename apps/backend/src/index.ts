import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./middleware/requestLogger";

app.listen(env.PORT, () => {
  logger.info({
    message: "Server running",
    port: env.PORT,
    environment: env.NODE_ENV,
  });
});
