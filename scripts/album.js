function setSong(songNumber){
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber -1];
};

function getSongNumberCell (number){
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
	var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

	var $row = $(template);

	var clickHandler = function() {
		var songNumber = parseInt($(this).attr('data-song-number'));

		if (currentlyPlayingSongNumber !== null) {
			var currentlyPlayingSection = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingSection.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== songNumber) {
			$(this).html(pauseButtonTemplate);
			setSong(songNumber);
			updatePlayerBarSong();
		}
		else if (currentlyPlayingSongNumber === songNumber) {
			$(this).html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;
		}
	};

	var onHover = function(event) {
		var songNumberItem = $(this).find('.song-item-number');
		var songNumber = parseInt(songNumberItem.attr('data-song-number'));

		if (songNumber !== currentlyPlayingSongNumber) {
		   songNumberItem.html(playButtonTemplate);
		}
     };
     var offHover = function(event) {
         var songNumberItem = $(this).find('.song-item-number');
		 var songNumber = parseInt(songNumberItem.attr('data-song-number'));

		 if (songNumber !== currentlyPlayingSongNumber) {
		 	songNumberItem.html(songNumber);
		 }
		 console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };

	$row.find('.song-item-number').click(clickHandler);

    $row.hover(onHover, offHover);

    return $row;
};

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

var setCurrentAlbum = function(album) {
	currentAlbum = album;
	$albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

	for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
    }
 };

 function trackIndex (album, song) {
	 return album.songs.indexOf(song);
 };

function updatePlayerBarSong () {
	 $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
	 $('.main-controls .play-pause').html(playerBarPauseButton);
 };

function nextSong (){
	var songCurrentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	songCurrentIndex++;

	if(songCurrentIndex >= currentAlbum.songs.length) {
		songCurrentIndex = 0;
	}

	var lastSongNumber = currentlyPlayingSongNumber;

	currentlyPlayingSongNumber = songCurrentIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[songCurrentIndex];

	updatePlayerBarSong();

	var $nextSongNumberItem = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberItem = getSongNumberCell(lastSongNumber);

	$nextSongNumberItem.html(pauseButtonTemplate);
	$lastSongNumberItem.html(lastSongNumber);
};

function priorSong (){
	var songCurrentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	songCurrentIndex--;

	if(songCurrentIndex < 0) {
		songCurrentIndex = currentAlbum.songs.length -1;
	}

	var lastSongNumber = currentlyPlayingSongNumber;

	currentlyPlayingSongNumber = songCurrentIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[songCurrentIndex];

	updatePlayerBarSong();

	var $priorSongNumberItem = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberItem = getSongNumberCell(lastSongNumber);

	$priorSongNumberItem.html(pauseButtonTemplate);
	$lastSongNumberItem.html(lastSongNumber);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function(){
	setCurrentAlbum(albumPicasso);
	$previousButton.click(priorSong);
	$nextButton.click(nextSong);

	var albumList = [albumPicasso, albumMarconi, albumMayer];
	var order = 1;

	$albumImage[0].addEventListener("click", function(event){
	    setCurrentAlbum(albumList[order]);
	    order++;
	    if(order === albumList.length){
	        order = 0;
	    }
	});
});
