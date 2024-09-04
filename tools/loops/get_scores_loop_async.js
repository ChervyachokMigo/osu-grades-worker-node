const path = require('path');
const async_start = require('async-calculations');

const { osu_auth, get_token } = require('../osu_auth');
const { check_userid, concat_array_of_arrays } = require('../misc');

/**
 * args: userid, gamemode, beatmapsets
 */
const _this = module.exports = async({ args, score_mode }) => {

	if (score_mode !== 1 && score_mode !== 2) {
		console.error( '[score_mode] > unsupported score mode' );
        return;
	}

	const userid = check_userid( args.userid );
	if (!userid) return;

	const beatmaps_list = args.beatmapsets || []

	if ( score_mode > 1 ){
		//console.log( 'authing to osu' );
		await osu_auth();
	}

	let i = 0;
	const chunk_size = 102;
	const workers_length = 6;

	let result = [];

	while(true) {
		
		const data_chunk = beatmaps_list.slice(i, i + chunk_size);

		if (data_chunk.length === 0) {
			//console.log( 'No more beatmaps to process' );
			break;
		}

		const procedure_filename = score_mode === 1 ? 'get_score_v1_async.js' : score_mode === 2 ? 'get_score_v2_async.js' : '';

		const data_out = await async_start({
			max: workers_length,
			data: data_chunk,
			//proxy_list: proxy_list,
			procedure_path: path.join(__dirname, 'async_procedures', procedure_filename),
			procedure_data: { userid: userid, v2_token: get_token() },
			IS_STDOUT: false,
			IS_DEBUG: false
		});

		const data_to_save = concat_array_of_arrays( data_out.filter( x => x.data_out !== null ).map( x => x.data_out ));
		
		result = result.concat(data_to_save);

		i += chunk_size;
	}

	return result;

};
