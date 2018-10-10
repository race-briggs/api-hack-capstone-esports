'use strict';

const pandaScoreApiKey = "oiTb1aNeODTo9jIMKINBpZ5zmGF50dNfZ3WQspL_-Xn6rBwuxs8";
const twitchApiKey = "tszgw747t4ad80nlczn9t658cma89p";


/* function formatSearchQuery(params) {
	console.log('formatting ran!');
	const queryTerm = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryTerm.join('&');
} */

function displayResults(response, maxResults=10) {
	console.log('displayResults ran!');
	console.log(responseJson);
}

function fetchTwitchStreamData(query, maxResults=10) {

	const options = {
		mode: 'cors',
		method: 'GET',
		headers: new Headers ({
			'accept': 'application/json',
			'Client-ID': twitchApiKey,
		})
	}

	const url = `https://api.twitch.tv/kraken/search/streams?query=${encodeURIComponent(query)}`

	fetch(url, options)
		.then(response => {
			if(response.ok){
				return response.json();
			} else {
				throw new Error(response.statusText);
			}
		})
		.then(responseJson => displayResults(responseJson, maxResults))
		//.then(console.log(JSON.stringify(responseJson)))
		.catch(e => {
			alert('An error occurred.');
		});
}

function fetchTwitchClipsData(query, maxResults=10) {

	const options = {
		mode: 'cors',
		method: 'GET',
		headers: new Headers ({
			'accept': 'application/json',
			'Client-ID': twitchApiKey
		})
	};

	const url = `https://api.twitch.tv/kraken/clips/top?game=${query}&limit=${maxResults}`

	fetch(url, options)
		.then(response => {
			if(response.ok){
				return response.json();
			} else {
				throw new Error(response.statusText);
			}
		})
		.then(responseJson => displayResults(responseJson, maxResults))
		.catch(e => {
			alert('An error occurred.');
		});

}

function fetchEsportsData(query, maxResults=10) {

	const options = {
		mode: 'cors',
		method: 'GET',
		headers: new Headers({
			'accept': 'application/json',
			'token': pandaScoreApiKey
		})
	}

	const url = `https://api.pandascore.co/videogames/${encodeURIComponent(query)}/tournaments`

	fetch(url, options)
		.then(response => {
			if(response.ok){
				return response.json();
			} else {
				throw new Error(response.statusText);
			}
		})
		.then(responseJson => displayResults(responseJson, maxResults))
		.catch(e => {
			alert('An error occurred.');
		});

}


function watchSubmit() {
	$('#js-form').submit(event => {
		event.preventDefault();
		let searchTerm = $('.js-search').val();
		let maxResults = $('.js-max-results').val();
		if($('.js-checkbox-1').is(":checked")){
			fetchTwitchStreamData(searchTerm, maxResults);
		};
		if($('.js-checkbox-2').is(":checked")){
			fetchTwitchClipsData(searchTerm, maxResults);
		};
		if($('.js-checkbox-3').is(":checked")){
			fetchEsportsData(searchTerm, maxResults);
		};
		});
	$('.js-search').val('');
	$('.js-max-results').val('');
}

$(watchSubmit);