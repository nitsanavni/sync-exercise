import test from "ava";

// helpers
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rand = (max) => Math.floor(Math.random() * max);
const times = (n, cb) => {
    for (let i = 0; i < n; i++) {
        cb();
    }
};

// to run this test, run: `npx ava sync.test.mjs` from cli
test("synchronize two expressions", async (t) => {
    t.plan(1);

    // TODO: dummy implementation - replace me
    const sync = async () => {};

    const timestamps = [];

    times(2, async () => {
        await sleep(rand(1000));
        await sync();
        timestamps.push(new Date().valueOf());

        if (timestamps.length === 2) {
            const diff = timestamps[1] - timestamps[0];
            t.true(diff < 10, `the two timestamps are ${diff}ms apart`);
        }
    });

    await sleep(1100);
});
