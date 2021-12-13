const {isPrismaError, createError} = require("../utils/prisma");

const INTERVAL = 1000 * 60;

/**
 * Start the interval for update DB from cache.
 *
 * @param  {import('../utils/prisma').prisma} prisma
 * @param  {import('node-cache')} bikeCache
 */
const initCacheToPrisma = (prisma, bikeCache) => {
    setInterval(() => {
        const keys = bikeCache.keys();
        const dbInterval = Math.floor((INTERVAL / keys.length) * 0.5);

        let minUpdateTime = 100000;
        let maxUpdateTime = 0;
        let totalUpdateTime = 0;
        let updates = 0;

        keys.forEach((key, index) => {
            setTimeout(() => {
                const start = Date.now();

                prisma.bike
                    .update({
                        where: {
                            id: key,
                        },
                        data: bikeCache.get(key),
                    })
                    .then(data => {
                        const updateTime = Date.now() - start;

                        minUpdateTime = minUpdateTime < updateTime ? minUpdateTime : updateTime;
                        maxUpdateTime = maxUpdateTime > updateTime ? maxUpdateTime : updateTime;
                        totalUpdateTime += updateTime;
                        updates++;

                        console.log("prisma updated id:", key, "in(ms): ", updateTime, "\tavg:", Math.round(totalUpdateTime/updates), "min: ", minUpdateTime, "max: ", maxUpdateTime);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }, dbInterval * index);
        });
    }, INTERVAL);
};

module.exports = { initCacheToPrisma };
