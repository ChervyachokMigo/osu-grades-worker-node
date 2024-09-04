
const config_control = require("./modules/config_control");
const worker_server = require("./modules/worker/server");
const { osu_auth } = require("./tools/osu_auth");

config_control.init();

const process_args = process.argv.slice(2);

if (process_args.length === 0) {
	console.log("Usage: node index.js [ip]");
    process.exit(1);
}

(async () => {
	await worker_server.init( process_args[0] );
}) ();