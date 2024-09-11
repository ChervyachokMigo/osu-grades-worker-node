const { WebSocket } = require('ws');
const { readFileSync, existsSync, writeFileSync } = require('fs');
const { servers_list_path } = require('../misc/const');
const ip_request = require('./ip_request');
const config = require('./config_control');

let servers_list = [];

const get_main_servers_list = async () => {
	const main_server_ip = config.get_value( 'main_server' ); 
	const worker_port = config.get_value( 'WORKER_SERVER_PORT' );

	return await new Promise( (res, rej) => {

		const worker_connection = new WebSocket(`ws:\\\\${main_server_ip}:${worker_port}`, { timeout: 10000});

		worker_connection.on('open', () => {
			worker_connection.send(JSON.stringify({ action: 'get_servers_list', request_data: null }));
		});
		
		worker_connection.on('close', () => {
			console.log(`[${main_server_ip}] WORKER_CLIENT disconnected`);
		});
		
		worker_connection.on('message', (message) => {
			const { action, response_data } = JSON.parse(message);
			console.log('message', message)
			switch(action) {
				case 'get_servers_list':
					res(response_data);
					break;
				default:
					console.error(`[${main_server_ip}] Unknown action: ${action}`);
					rej(new Error(`[${main_server_ip}] Unknown action: ${action}`));
					break;
			}

		});
		
		worker_connection.onerror = (error) => {
			rej(error.error);
		};
	
	});
}

let server_ip = null;

const _this = module.exports = {
	save_severs_list: ( data ) => writeFileSync(servers_list_path, JSON.stringify( servers_list )),

	add_host: async (hostname, port) => {
		const new_host = { hostname, port };
		if (servers_list.findIndex( v => v.hostname === hostname ) === -1 ){
			servers_list.push(new_host);
			_this.save_severs_list(servers_list);
		}
	},

	load_servers_list: async () => {
		const worker_port = config.get_value( 'WORKER_SERVER_PORT' );
		if (existsSync(servers_list_path)) {
			servers_list = JSON.parse(readFileSync(servers_list_path, 'utf8'));
		} else {
			await _this.add_host(server_ip, worker_port);
		}
	},

	init: async () => {
		const main_server_ip = config.get_value( 'main_server' ); 
		server_ip = await ip_request();
		if (server_ip === main_server_ip) {
			console.log(`[${server_ip}] This is the main server`);
            await _this.load_servers_list();
		} else {
			console.log(`[${server_ip}] This is an alt server`);
			try{
				const res = await get_main_servers_list();
				servers_list = res;
				_this.save_severs_list(servers_list);
				console.log(`[${server_ip}] Successfully connected to main server and loaded servers list`);
			} catch (e) {
				if (e.code === 'ETIMEDOUT') {
					console.log('no connection to main server');
					console.log('loading server list from cache');
					await _this.load_servers_list();
				} else {
					console.error(`Error getting main servers list`, e);
				}
				
			}
		}

	},

	get_servers_list: async (worker_address) => {
		const worker_port = config.get_value( 'WORKER_SERVER_PORT' );
		await _this.add_host(worker_address, worker_port);
		return servers_list;
	}
}