const { default: axios } = require("axios");

module.exports = async () => {
	const result = await axios.get(
		'http://api.ipify.org', 
		{ data: { format: 'json' }});
	return result.data;
}