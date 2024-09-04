const { v2 } = require('osu-api-extended');

module.exports = {
	request_beatmap_user_scores_v2: async ({ 
		beatmap_id, userid, gamemode = null, 
		sort_condition = 'total_score', notice_miss = false, best_only = false }) => {

		const data = await v2.scores.user.beatmap( beatmap_id, userid, { mode: gamemode, best_only }).catch( (e) => {
			console.error( 'request user scores on beatmap error' );
			throw new Error (e);
		});

		if (!data || data.error ){
			console.error( 'Request user scores on beatmap error: ', data?.error );
			return null;
		}

		if (data && typeof data == 'object' && data.length > 0){
			data.sort( (a, b) => b[sort_condition] - a[sort_condition] );            
			return data;
		}

		if (notice_miss) {
			console.error('warning: no scores for beatmap', beatmap_id, 'for user', userid );
		}

		return null;
	},

};