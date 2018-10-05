'use strict';

const pandaScoreApiKey = "oiTb1aNeODTo9jIMKINBpZ5zmGF50dNfZ3WQspL_-Xn6rBwuxs8";
const twitchApiKey = "tszgw747t4ad80nlczn9t658cma89p";


function formatSearchQuery(params) {

}

function displayResults(response, maxResults) {

}

function fetchTwitchStreamData(query, maxResults) {

}

function fetchTwitchClipsData(query, maxResults) {

}

function fetchEsportsData(query, maxResults) {

}


function watchSubmit() {
	let searchTerm = $('.js-search').val();
	let maxResults = $('.js-max-results').val();
	$('#js-form').submit(event => {
		event.preventDefault();
		if($('.js-checkbox-1').checked){
			fetchTwitchStreamData(searchTerm, maxResults);
		};
		if($('.js-checkbox-2').checked){
			fetchTwitchClipsData(searchTerm, maxResults);
		};
		if($('.js-checkbox-3').checked){
			fetchEsportsData(searchTerm, maxResults);
		};
		});
	$('.js-search').val('');
	$('.js-max-results').val('');
}

$(watchSubmit);