//'use strict';


const twitchApiKey = "tszgw747t4ad80nlczn9t658cma89p";


 function formatSearchQuery(params) {
	console.log('formatting ran!');
	const queryTerm = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryTerm.join('&');
}

let maxResults = 10;

function displayStreams(responseJson, maxResults) {
	console.log('displayStreams ran!');
	console.log(responseJson);
	$('.js-results-1').empty();
	$('.js-results-1').append(
		`<ul class="stream-results-list">
			<li><h3>Top Live Streams</h3></li>
		</ul>`
		);
	for(let i = 0; i < maxResults; i++) {
		$('.stream-results-list').append(`
			<li class="stream-result">
				<h4>${responseJson.streams[i].channel.name}</h4>
				<img class="stream-preview" src="${responseJson.streams[i].preview.medium}">
				<a class="stream-url" href="${responseJson.streams[i].channel.url}">${responseJson.streams[i].channel.url}</a>
			</li>
			`)
	$('.results-container-1').removeClass('hidden');
	};
};


function displayClips(responseJson, maxResults) {
	console.log('displayClips ran!');
	console.log(responseJson);
	$('.js-results-2').empty();
	$('.js-results-2').append(
		`<ul class="clip-results-list">
			<li><h3>Top Clips</h3></li>
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

function displayYouTubeResults(responseJson, maxResults) {
	console.log('displayYouTubeResults ran!');
	console.log(responseJson);
	$('.js-results-3').empty();
	$('.js-results-3').append(
		`<ul class="yt-results-list">
			<li><h3>Top YouTube Videos</h3></li>
		</ul>`
		);
	for(let i = 0; i < maxResults; i++) {
		$('.yt-results-list').append(`
			<li class="yt-li">
				<a class="yt-title" href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}">${responseJson.items[i].snippet.title}</a>
				<img class="yt-thumbnail" src="${responseJson.items[i].snippet.thumbnails.medium.url}">
			</li>
			`)
		$('.results-container-3').removeClass('hidden');
	};
}

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
			//'Authorization': 'Bearer AIzaSyAXgHhbaVGMsi4Sfvf2vbdiP6jNMonQ5FA'

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