
const config_control = require("./modules/config_control");
const servers_list = require("./modules/servers_list");
const worker_server = require("./modules/worker/server");

config_control.init();

const process_args = process.argv.slice(2);
/*
if (process_args.length === 0) {
	console.log("Usage: node index.js [ip]");
    process.exit(1);
}*/

(async () => {
	await servers_list.init();
	await worker_server.init( process_args[0] || '127.0.0.1' );
}) ();