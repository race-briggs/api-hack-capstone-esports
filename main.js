//'use strict';

const pandaScoreApiKey = "I1gUWPYeIdH3ocN94UHnd5Zfpvchy78r4ZE_ZfHAZczefqTpojg";
const twitchApiKey = "tszgw747t4ad80nlczn9t658cma89p";


/* function formatSearchQuery(params) {
	console.log('formatting ran!');
	const queryTerm = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryTerm.join('&');
} */

let streamCalled = 0;
let clipsCalled = 0;
let esportsCalled = 0;
let maxResults = 10;

function displayResults(responseJson, maxResults) {
	console.log('displayResults ran!');
	console.log(responseJson);
	if(streamCalled > 0){
			$('.js-results-1').empty();
			$('.js-results-1').append(
				`<h3>Top Live Streams</h3>
				<ul class="stream-results-list"></ul>`
				);
			for(let i = 0; i < maxResults; i++) {
				$('.stream-results-list').append(`
					<li class="stream-result">
						<h4>${responseJson.streams[i].channel.name}</h4>
						<img class="stream-preview" src="${responseJson.streams[i].preview.medium}">
						<a class="stream-url" href="${responseJson.streams[i].channel.url}">${responseJson.streams[i].channel.url}</a>
					</li>
					`)
			};
			streamsCalled = 0;
		};
	if(clipsCalled > 0){
			$('.js-results-2').empty();
			$('.js-results-2').append(
				`<h3>Top Clips</h3>
				<ul class="clip-results-list"></ul>`
				);
			for(let i = 0; i < maxResults; i++) {
				$('.clip-results-list').append(`
					<li class="clip-li">
						<h4>${responseJson.clips[i].title}</h4>
						<iframe
				    src="${responseJson.clips[i].embed_url}"
				    height="300"
				    width="400"
				    preload="metadata"
				    frameborder=""
				    scrolling="no"
				    allowfullscreen="true"
				    autoplay="false">
						</iframe>
					</li>
					`)
			};
			clipsCalled = 0;
		};

	
	
	esportsCalled = 0;
}

function fetchTwitchStreamData(query, maxResults) {

	streamCalled++;

	const options = {
		method: 'GET',
		headers: new Headers ({
			'accept': 'application/json',
			'Client-ID': twitchApiKey,
		})
	}

	const url = `https://api.twitch.tv/kraken/search/streams?query=${encodeURIComponent(query)}&limit=${maxResults}`

	fetch(url, options)
		.then(response => {
			if(response.ok){
				return response.json();
			} else {
				throw new Error(response.statusText);
			};
		})
		.then(responseJson => displayResults(responseJson, maxResults))
		.catch(e => {
			console.log(e);
		});
}

function fetchTwitchClipsData(query, maxResults) {

	clipsCalled++;

	const options = {
		method: 'GET',
		headers: new Headers ({
			'Accept': 'application/vnd.twitchtv.v5+json',
			'Client-ID': twitchApiKey
		})
	};

	const url = `https://api.twitch.tv/kraken/clips/top?game=${encodeURIComponent(query)}&limit=` + maxResults

	fetch(url, options)
		.then(response => {
			if(response.ok){
				return response.json();
			} else {
				console.log(response);
				throw new Error(response);
			};
		})
		.then(responseJson => displayResults(responseJson, maxResults))
		.catch(e => {
			console.log(e);
		});

}

function fetchEsportsData(query, maxResults) {

	const options = {
		mode: 'cors',
		method: 'GET',
		headers: new Headers({
			//'Accept': 'application/json',
			//'Authorization': 'Bearer I1gUWPYeIdH3ocN94UHnd5Zfpvchy78r4ZE_ZfHAZczefqTpojg'

		})
	}

	//const url = `https://api.pandascore.co/videogames/${encodeURIComponent(query)}/tournaments`

	const url = `https://api.pandascore.co/videogames?token=I1gUWPYeIdH3ocN94UHnd5Zfpvchy78r4ZE_ZfHAZczefqTpojg`

	fetch(url, options)
		.then(response => {
			if(response.ok){
				return response.json();
			} else {
				console.log(response);
				throw new Error(response);
			}
		})
		.then(responseJson => displayResults(responseJson, maxResults))
		.catch(console.error);

}


function watchSubmit() {
	$('#js-form').submit(event => {
		event.preventDefault();
		let searchTerm = $('.js-search').val();
		maxResults = $('.js-max-results').val();
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