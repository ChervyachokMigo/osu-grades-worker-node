const path = require('path');

module.exports = {
	gamemode: [ 'osu', 'taiko', 'fruits', 'mania' ],

	text_score_mode: Array(1).concat([ 'v1', 'v2', 'v2 json' ]),
	print_progress_frequency: 4,

	beatmaps_v1_request_limit: 500,
	beatmaps_v2_request_limit: 50,

	osu_token_path: path.join('data', 'osu_token.json'),
	cache_path: path.join( 'data', 'cache' ),
	config_path: path.join('data', 'config.json'),
	default_config_path: path.join( __dirname, '..', 'misc', 'config-sample.json'),
	servers_list_path: path.join( 'data', 'servers.json' ),
};

