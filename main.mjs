import util from 'util';

import redis from 'redis';
import createRedisClient from 'redis/lib/createClient.js';

class _PromiseRedis extends redis.RedisClient {
    constructor(...args) {
        if (args.length === 0)
            args = ['redis://localhost']

        super(createRedisClient(args));
    }
}

export default function PromiseRedis(...args) {
    const client = new _PromiseRedis(...args);

    client.on('error', msg => console.error(msg), null);

    return new Proxy(client, {
        get(target, key, receiver) {
            return target.hasOwnProperty(key)
                ? client[key]
                : util.promisify(client[key]).bind(client)
            ;
        }
    });
}
