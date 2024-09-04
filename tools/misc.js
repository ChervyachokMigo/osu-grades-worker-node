const { existsSync, mkdirSync, readdirSync, unlinkSync, readFileSync } = require('fs');

const { gamemode, print_progress_frequency } = require('../misc/const');
const path = require('path');

const _this = module.exports = {
	folder_prepare: ( path ) =>{
		try{
			if ( !existsSync( path )) 
				mkdirSync( path, { recursive: true }); 
			return true;
		} catch (e) {
			console.error( 'Cannot create folder:', path );
			console.error(e);
			return false;
		}
	},

	check_userid: ( val ) => {
		const userid = Number(val) || null;
		if ( !userid || isNaN( userid ) || userid == 0 ){
			console.error( 'userid invalid:', userid );
			return null;
		}
		return userid;
	},

	concat_array_of_arrays: ( arr ) => [].concat(...arr),

	escape_windows_special_chars( input ) {
		// eslint-disable-next-line no-control-regex
		const special_chars = /[\x00-\x1f\\:*?"<>|]/g;

		return input.replace( special_chars, '_' );
	},

	delete_files_in_folder: (folder_path) => {
		try {
			const files = readdirSync(folder_path);

			files.for_each(file => {
				const file_path = path.join(folder_path, file);
				unlinkSync(file_path);
			});
		} catch ( err ) {
			console.error( 'error deleting files:', err );
		}
	},

	isJSON: ( str ) => {
		try { 
			JSON.parse( str.toString() );
		} catch (e) { 
			return false; 
		}
		return true;
	},

	load_json: ( filepath, default_value = null ) => {
		if (existsSync( filepath )){
			const data = readFileSync( filepath, 'utf8' );
			if ( _this.isJSON( data )){
				return JSON.parse( data );
			}
		} 

		return default_value;
	},

};