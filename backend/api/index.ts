import express from 'express';
import cors from 'cors';

let app = express();
let errorMsg = '';

try {
  // Use dynamic import for ESM
  const mod = await import("../src/app.js");
  app = mod.default || mod;
  
  const redisMod = await import("../src/app/lib/redis.js");
  if (redisMod && redisMod.redisClient) {
    redisMod.redisClient.connect().catch(console.error);
  }
} catch (e: any) {
  errorMsg = String(e) + '\n' + (e.stack || '');
  app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.all('*', (req, res) => {
    res.status(200).json({
      success: false,
      message: "Server Initialization Error",
      error: errorMsg
    });
  });
}

export default app;
