'use strict';


const twitchApiKey = "tszgw747t4ad80nlczn9t658cma89p";

//format search params function, if necessary or easier
 function formatSearchQuery(params) {
	console.log('formatting ran!');
	const queryTerm = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryTerm.join('&');
}

let maxResults = 5;

//needed separate display functions in order to achieve the separate search/results parameters and their differing layouts
//display fetch stream data results function
function displayStreams(responseJson, maxResults) {
	console.log('displayStreams ran!');
	console.log(responseJson);
	$('.js-results-1').empty();
	$('.js-results-1').append(
		`<ul class="stream-results-list">
			<li><h3 class="section-title">top live streams</h3></li>
		</ul>`
		);
	for(let i = 0; i < maxResults; i++) {
		$('.stream-results-list').append(`
			<li class="stream-result">
				<h4>${responseJson.streams[i].channel.name}</h4>
				<a href="${responseJson.streams[i].channel.url}"><img class="stream-preview" src="${responseJson.streams[i].preview.medium}"></a>
				<a class="stream-url" href="${responseJson.streams[i].channel.url}">${responseJson.streams[i].channel.url}</a>
			</li>
			`)
	$('.results-container-1').removeClass('hidden');
	};
};

//display fetch clips results function
function displayClips(responseJson, maxResults) {
	console.log('displayClips ran!');
	console.log(responseJson);
	$('.js-results-2').empty();
	$('.js-results-2').append(
		`<ul class="clip-results-list">
			<li><h3 class="section-title">top clips</h3></li>
		</ul>`
		);
	for(let i = 0; i < maxResults; i++) {
		$('.clip-results-list').append(`
			<li class="clip-li">
				<h4>${responseJson.clips[i].title}</h4>
				<iframe
		    src="https://clips.twitch.tv/embed?clip=${responseJson.clips[i].slug}&autoplay=false"
		    height="225"
		    width="300"
		    preload="metadata"
		    scrolling="no"
		    allowfullscreen="true">
				</iframe>
			</li>
			`)
		$('.results-container-2').removeClass('hidden');
	};
};

//display fetch YouTube API for videos results function
function displayYouTubeResults(responseJson, maxResults) {
	console.log('displayYouTubeResults ran!');
	console.log(responseJson);
	$('.js-results-3').empty();
	$('.js-results-3').append(
		`<ul class="yt-results-list">
			<li><h3 class="section-title">top youtube videos</h3></li>
		</ul>`
		);
	for(let i = 0; i < maxResults; i++) {
		$('.yt-results-list').append(`
			<li class="yt-li">
				<a class="yt-title" href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}">${responseJson.items[i].snippet.title}</a>
				<a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}"><img class="yt-thumbnail" src="${responseJson.items[i].snippet.thumbnails.medium.url}"></a>
			</li>
			`)
		$('.results-container-3').removeClass('hidden');
	};
}

//needed separate fetch requests because of the different params required for the fetch requests
//fetch twitch API for streams function
function fetchTwitchStreamData(query, maxResults) {

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
		.then(responseJson => displayStreams(responseJson, maxResults))
		.catch(e => {
			console.log(e);
		});
}

//fetch twitch API for clips fucnction
function fetchTwitchClipsData(query, maxResults) {

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
		.then(responseJson => displayClips(responseJson, maxResults))
		.catch(e => {
			console.log(e);
		});
}


//fetch YouTube API for videos
function fetchYoutubeData(query, maxResults) {

	const params = {
		'q': query,
		'maxResults': maxResults,
		'part': 'snippet',
		'key': 'AIzaSyAXgHhbaVGMsi4Sfvf2vbdiP6jNMonQ5FA'
	}

	const url = 'https://www.googleapis.com/youtube/v3/search' + '?' + formatSearchQuery(params)
	console.log(url);

	const options = {
		method: 'GET',
		headers: new Headers({
			'Accept': 'application/json',
		})
	};

	fetch(url, options)
		.then(response => {
			if(response.ok){
				return response.json();
			} else {
				console.log(response);
				throw new Error(response);
			}
		})
		.then(responseJson => displayYouTubeResults(responseJson, maxResults))
		.catch(console.error);
}

//watch for submission, clear the results for new searches
function watchSubmit() {
	$('#js-form').submit(event => {
		event.preventDefault();
		$('.js-results-1').addClass('hidden');
		$('.js-results-2').addClass('hidden');
		$('.js-results-3').addClass('hidden');
		let searchTerm = $('.js-search').val();
		maxResults = $('.js-max-results').val();
		if($('.js-checkbox-1').is(":checked")){
			fetchTwitchStreamData(searchTerm, maxResults);
		};
		if($('.js-checkbox-2').is(":checked")){
			fetchTwitchClipsData(searchTerm, maxResults);
		};
		if($('.js-checkbox-3').is(":checked")){
			fetchYoutubeData(searchTerm, maxResults);
		};
		});
	$('.js-search').val('');
	$('.js-max-results').val('');
}

$(watchSubmit);