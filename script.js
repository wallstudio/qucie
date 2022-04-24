var tasks = [];

function qucieCall(input, callback) {

    const task = { id: Math.random(), promise: null, resolve: null, result: null };
    task.promise = new Promise(r => task.resolve = r);
    tasks.push(task);
    browser.runtime.sendMessage({ type: "qucieCall", id: task.id, input: input, });
    task.promise.then(result => {
        task.result = result;
        callback(cloneInto(result, window, { cloneFunctions: true }));
    });
}
exportFunction(qucieCall, window, { defineAs: qucieCall.name });

function qucieResult(args) {
    if(args.type != "qucieResult") return;

    const task = tasks.find(t => t.id == args.id);
    tasks = tasks.filter(t => t != task);
    task.resolve(args.output);
}
browser.runtime.onMessage.addListener(qucieResult);

console.log(qucieCall);

// ex.
// console.log(await new Promise(r => qucieCall("https://google.com", r)));
