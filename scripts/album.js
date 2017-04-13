function setSong(songNumber){
	if (currentSoundFile) {
         currentSoundFile.stop();
     }

	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber -1];

	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: ['mp3'],
         preload: true
     });
	 setVolume(currentVolume);
};

function seek (time) {
	if(currentSoundFile){
		currentSoundFile.setTime(time);
	}
};

function setVolume (volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

function getSongNumberCell (number){
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
	var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    + '</tr>'
    ;

	var $row = $(template);

	var clickHandler = function() {
		var songNumber = parseInt($(this).attr('data-song-number'));

		if (currentlyPlayingSongNumber !== null) {
			var currentlyPlayingSection = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingSection.html(currentlyPlayingSongNumber);
			currentSoundFile.unbind('timeupdate');
		}
		if (currentlyPlayingSongNumber !== songNumber) {
			$(this).html(pauseButtonTemplate);
			setSong(songNumber);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
			var $volFill = $('.volume .fill');
			var $volThumb = $('.volume .thumb');
			$volFill.width(currentVolume + '%');
			$volThumb.css({left: currentVolume + '%'});
			updatePlayerBarSong();
		}
		else if (currentlyPlayingSongNumber === songNumber) {
			if (currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
			} else {
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPlayButton);
				currentSoundFile.pause();
            }
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

 var updateSeekBarWhileSongPlays = function() {
      if (currentSoundFile) {
          currentSoundFile.bind('timeupdate', function(event) {
              var seekBarFillRatio = this.getTime() / this.getDuration();
              var $seekBar = $('.seek-control .seek-bar');

              updateSeekPercentage($seekBar, seekBarFillRatio);
			  setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
          });
      }
	 // currentSoundFile.unbind('timeupdate');
  };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	var offsetXPercent = seekBarFillRatio * 100;

	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);

	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;

		 if($(this).parent().attr('class') === 'seek-control'){
			 seek(seekBarFillRatio * currentSoundFile.getDuration());
		 }
		 else {
			 setVolume(seekBarFillRatio * 100);
		 }

         updateSeekPercentage($(this), seekBarFillRatio);
     });

	 $seekBars.find('.thumb').mousedown(function(event) {
         var $seekBar = $(this).parent();

         $(document).on('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

			 if($(this).parent().attr('class') === 'seek-control'){
				 seek(seekBarFillRatio * currentSoundFile.getDuration());
			 }
			 else {
				 setVolume(seekBarFillRatio *100);
			 }

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

         $(document).on('mouseup.thumb', function() {
             $(document).off('mousemove.thumb');
             $(document).off('mouseup.thumb');
         });
     });
 };

function setCurrentTimeInPlayerBar (currentTime) {
	$('.seek-control .current-time').html(currentTime);
};

function setTotalTimeInPlayerBar (totalTime){
	$('.seek-control .total-time').html(totalTime);
};

function filterTimeCode (timeInSeconds) {
	var timeInDecimalForm = parseFloat(timeInSeconds / 60);

	var minutesTotal = Math.floor(timeInDecimalForm);
	var secondsTotal = Math.floor(timeInSeconds % 60);

	if (secondsTotal < 10){
		secondsTotal = '0' + secondsTotal;
	}
	return (minutesTotal + ':' + secondsTotal);
};

function trackIndex (album, song) {
	return album.songs.indexOf(song);
};

function updatePlayerBarSong () {
	 $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
	 $('.main-controls .play-pause').html(playerBarPauseButton);
	 setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
 };

function newSong (event){
	var clicked = $(this).attr('class');
	var songCurrentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	var lastSongNumber = currentlyPlayingSongNumber;
	if(clicked === 'next'){
		songCurrentIndex++;
		if(songCurrentIndex >= currentAlbum.songs.length) {
			songCurrentIndex = 0;
		}
	}
	else if (clicked === 'previous'){
		songCurrentIndex--;
		if(songCurrentIndex < 0) {
			songCurrentIndex = currentAlbum.songs.length - 1;
		}
	}
	setSong(songCurrentIndex + 1);
	currentSoundFile.play();
	updatePlayerBarSong();
	updateSeekBarWhileSongPlays();

	var $priorSongNumberItem = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberItem = getSongNumberCell(lastSongNumber);

	$priorSongNumberItem.html(pauseButtonTemplate);
	$lastSongNumberItem.html(lastSongNumber);
};

function togglePlayFromPlayerBar () {
	var $currentlyPlayingSection = getSongNumberCell(currentlyPlayingSongNumber);

    if (currentSoundFile.isPaused()) {
        $currentlyPlayingSection.html(pauseButtonTemplate);
		$playPause.html(playerBarPlayButton);
		updatePlayerBarSong();
		currentSoundFile.play();
	}
	else if (currentSoundFile.play()) {
	    $currentlyPlayingSection.html(playButtonTemplate);
		$playPause.html(playerBarPlayButton);
	    currentSoundFile.pause();
	}
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

$(document).ready(function(){
	setCurrentAlbum(albumPicasso);
	setupSeekBars();
	$previousButton.click(newSong);
	$nextButton.click(newSong);
	$playPause.click(togglePlayFromPlayerBar);

	var albumList = [albumPicasso, albumMarconi, albumMayer];
	var order = 1;

	$('.album-cover-art').click(function(event){
		setCurrentAlbum(albumList[order]);
		order++;
		if(order === albumList.length){
			order = 0;
		}
	});
});
