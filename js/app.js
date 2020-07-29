'use strict';

function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = parseInt((duration / 1000) % 60),
		minutes = parseInt((duration / (1000 * 60)) % 60),
		hours = parseInt((duration / (1000 * 60 * 60)) % 24);
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	return minutes + ":" + seconds;
}

const searchForm = document.querySelector('[data-search]');

searchForm.addEventListener('submit', sendRequest);

function sendRequest(event){
	event.preventDefault();
	console.log('ajax rocks');

	//"http://itunes.apple.com/search?term=Ozzborn";
	// this == search form
	// this.elements.query == search input	
	let url = `${this.action}?term=${this.elements.query.value}&limit=10`;  
	url = url.replace(/ /g, '+');

	console.log(url);
	
	fetch(url)
		.then( result => result.json() )
		.then( showTunes );	
}

const listEl = document.querySelector('[data-list]');
const tmpl = document.querySelector('[data-tmpl]').innerHTML;

function showTunes(data) {
	console.log(data);
	
	let listHtml = '';

	data.results.forEach(tunec => {
		let duration = msToTime(tunec.trackTimeMillis);
		let higehResImg = tunec.artworkUrl100.replace('100x100', '400x400');

		listHtml += tmpl
			.replace(/{{trackId}}/gi, tunec.trackId)
			.replace(/{{audio}}/gi, tunec.previewUrl)
			.replace(/{{Artist}}/gi, tunec.artistName)
			.replace(/{{SongName}}/gi, tunec.trackName)
			.replace(/{{cover}}/gi, higehResImg)
			.replace(/{{AlbumName}}/gi, tunec.collectionName)
			.replace(/{{GenreName}}/gi, tunec.primaryGenreName)
			.replace(/{{price}}/gi, tunec.collectionPrice)
			.replace(/{{collectionViewUrl}}/gi, tunec.collectionViewUrl)
			.replace(/{{duration}}/gi, duration)
	});

	listEl.innerHTML = listHtml; // Insert tunes in html

}

//Catch button click
let tempAudio;
let tempBtn;

listEl.addEventListener('click', (event) => {

	let el = event.target; //Get clicked button

	const audioId = el.dataset.trackId;

	if(!audioId) return; // If clicked not on button do nothing
	
	const currentAudio = document.getElementById(audioId);	

	if(tempAudio && tempAudio != currentAudio){
		tempAudio.pause(); //If not current audio pause
		tempBtn.classList.remove('pulse'); //If playing not current button remove pulsing
	}
	tempAudio = currentAudio;
	tempBtn = el;

	currentAudio.paused ? currentAudio.play() : currentAudio.pause();	

	el.classList.toggle('pulse');

});