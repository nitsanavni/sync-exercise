import test from "ava";

// helpers
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rand = (max) => Math.floor(Math.random() * max);
const times = (n, cb) => {
    const ret = [];

    for (let i = 0; i < n; i++) {
        ret.push(cb(i));
    }

    return ret;
};

const fun = async ({ sync, doIterate, afterSync }) => {
    let i = 0;

    while (doIterate()) {
        // TODO: implement `syncImpl` such that **all** invocations of `fun`
        //       wait for each other at this call to `sync()` for all the
        //       iterations of the while loop
        await sync();
        afterSync(i++);
        // Note that if you change the sleep to a constant - the test passes
        // await sleep(100);
        await sleep(rand(100));
    }
};

const syncImpl = () => {
    // TODO: dummy implementation - replace me
    return async () => {};
};

// to run this test, run: `npx ava sync.test.mjs` from cli
test("all iterations are synchronized", async (t) => {
    t.plan(10);

    // invoke `fun` 10 times
    let iterate = true;
    const doIterate = () => iterate;

    const acc = [];

    await new Promise((resolve) =>
        times(10, (f) =>
            fun({
                sync: syncImpl(),
                doIterate,
                afterSync: (i) => {
                    if (i >= 10) {
                        // end the test
                        iterate = false;
                        resolve();
                        return;
                    }

                    if (!acc[i]) {
                        acc[i] = [];
                    }

                    acc[i].push(new Date().valueOf());

                    if (acc[i].length === 10) {
                        // acc[i] now holds all the timestamps of when `afterSync` was invoked in all `fun` invocations for iteration `i`
                        t.true(Math.max(...acc[i]) - Math.min(...acc[i]) < 10, `iteration ${i} timestamps ${acc[i]}`);
                    }
                },
            })
        )
    );
});
