import { createClient } from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: 'n4M4SUIBtca0wkkupsAX8zlgZz7cAm6s',
    socket: {
        host: 'strategic-grip-cloth-10636.db.redis.io',
        port: 13979
    }
});

