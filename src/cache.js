const Redis = require("./redis");

//   ###                 #
//  #   #                #
//  #       ###    ###   # ##    ###
//  #          #  #   #  ##  #  #   #
//  #       ####  #      #   #  #####
//  #   #  #   #  #   #  #   #  #
//   ###    ####   ###   #   #   ###
/**
 * A class that handles caching.
 */
class Cache {
    //          #     #
    //          #     #
    //  ###   ###   ###
    // #  #  #  #  #  #
    // # ##  #  #  #  #
    //  # #   ###   ###
    /**
     * Adds an object to the cache.
     * @param {string} key The key to add.
     * @param {object} obj The object to save.
     * @param {Date} [expiration] The date and time to expire the cache.
     * @param {string[]} [invalidationLists] A list of invalidation lists to add the key to.
     * @returns {Promise} A promise that resolves when the object has been added to the cache.
     */
    static async add(key, obj, expiration, invalidationLists) {
        const client = await Redis.login();

        if (expiration) {
            const time = Math.max(expiration.getTime() - new Date().getTime(), 1);
            await client.set(key, JSON.stringify(obj), "EX", time);
        } else {
            await client.set(key, JSON.stringify(obj));
        }

        if (invalidationLists) {
            for (const list of invalidationLists) {
                await client.sadd(list, key);
            }
        }
    }

    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets an object from the cache.
     * @param {string} key The key to get.
     * @returns {Promise<object>} A promise that resolves with the retrieved object.
     */
    static async get(key) {
        const client = await Redis.login();

        const value = await client.get(key);

        if (!value) {
            return void 0;
        }

        return JSON.parse(value);
    }

    //  #                      ##     #       #         #
    //                          #             #         #
    // ##    ###   # #    ###   #    ##     ###   ###  ###    ##
    //  #    #  #  # #   #  #   #     #    #  #  #  #   #    # ##
    //  #    #  #  # #   # ##   #     #    #  #  # ##   #    ##
    // ###   #  #   #     # #  ###   ###    ###   # #    ##   ##
    /**
     * Invalidates keys from a list of invalidate lists.
     * @param {string[]} invalidationLists The invalidation lists to invalidate.
     * @returns {Promise} A promise that resolves when the invalidation lists have been invalidated.
     */
    static async invalidate(invalidationLists) {
        const client = await Redis.login(),
            keys = [];

        for (const list of invalidationLists) {
            keys.push(list);

            const items = await client.smembers(list);

            if (items) {
                keys.push(...items);
            }
        }

        await client.del(...keys);
    }
}

module.exports = Cache;