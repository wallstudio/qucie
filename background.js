async function onMessage(args, sender) {
    if(args.type != "qucieCall") return;

    browser.notifications.create({
      "type": "basic",
      "title": "qucieCall",
      "message": args.input,
    });

    const response = await fetch(args.input);
    const bin = new Uint8Array(await response.arrayBuffer());
    const binStr = Array.from(bin).map(b => String.fromCharCode(b)).join("");
    const base64 = btoa(binStr);
    browser.tabs.sendMessage(sender.tab.id, { type: "qucieResult", id: args.id, output: base64 });
}
browser.runtime.onMessage.addListener(onMessage);
