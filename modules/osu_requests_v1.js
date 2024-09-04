const { default: axios } = require('axios');

const config = require('./config_control');

module.exports = {
	request_beatmap_user_scores: async ({ beatmap, userid, proxy }) => {
		try {
			//console.log({ beatmap, userid, proxy })
			const api_key = config.get_value('api_key');
			if (!api_key) return null;

			const url = `https://osu.ppy.sh/api/get_scores?k=${api_key}&b=${beatmap.beatmap_id}&u=${userid}&m=${beatmap.gamemode}`;
			const res = await axios.get( url, { proxy } );
			
			if (res && res.data && typeof res.data == 'object' && res.data.length > 0){
				const scores = res.data.map( score => ({ score, beatmap }));
				return scores;
			} else {
				return null;
			}
		} catch (e) {
			console.log('proxy', proxy)
			throw new Error( e );
		}
	},

};