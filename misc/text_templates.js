const { gamemode, text_score_mode } = require('./const');

module.exports = {
	found_X_scores_beatmap: ({ length, userid, beatmap }) =>
		`found ${length} scores of beatmap ${beatmap.md5} for user ${userid} with gamemode ${gamemode[beatmap.gamemode]}`,

	cache_beatmap_v1_filename: ( params ) => 
		`${params?.since_date}_`+
		`${params?.limit}_`+
		`${params?.gamemode}.json`,

	cache_beatmap_v2_filename: ( params ) => 
		`${params?.cursor_string ? params.cursor_string : 'null'}_` +
		`${params?.mode}_`+
		`${params?.sort}.json`,

};