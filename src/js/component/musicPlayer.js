import React, { useState, useEffect, useRef } from "react";

export function MusicPlayer() {
	const [listSongData, setListSongData] = useState([]);
	const [currentSong, setCurrentSong] = useState(-1);
	const [playingSong, setPlayingSong] = useState(false);
	const audioPlayer = useRef();

	useEffect(() => {
		fetch("https://assets.breatheco.de/apis/sound/songs")
			.then(function(response) {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(function(songData) {
				setListSongData(songData);
			})
			.catch(function(error) {
				console.log("Algo salio mal: \n", error);
			});
	}, []);

	function handleChangeSrcSong(newCurrentSong) {
		audioPlayer.current.src =
			"https://assets.breatheco.de/apis/sound/" +
			listSongData[newCurrentSong].url;
	}

	function handlePlaySong() {
		if (audioPlayer.current.src == "") {
			handleChangeSrcSong(currentSong + 1);
			setCurrentSong(0);
		}
		audioPlayer.current.play();
		setPlayingSong(true);
	}

	function handlePauseSong() {
		audioPlayer.current.pause();
		setPlayingSong(false);
	}

	function handleChangeNextSong() {
		if (audioPlayer.current.src != "") {
			if (currentSong == listSongData.length - 1) {
				setCurrentSong(0);
				handleChangeSrcSong(0);
			} else {
				setCurrentSong(currentSong + 1);
				handleChangeSrcSong(currentSong + 1);
			}
		}
		handlePlaySong();
	}

	function handleChangePreviousSong() {
		if (audioPlayer.current.src != "") {
			if (currentSong == 0) {
				setCurrentSong(listSongData.length - 1);
				handleChangeSrcSong(listSongData.length - 1);
			} else {
				setCurrentSong(currentSong - 1);
				handleChangeSrcSong(currentSong - 1);
			}
		}
		handlePlaySong();
	}

	function handleChangeClickedSong(positionSong) {
		handleChangeSrcSong(positionSong);
		handlePlaySong();
		setCurrentSong(positionSong);
	}

	return (
		<div className="container-fluid">
			<div>
				<audio ref={audioPlayer}>
					Your browser does not support the audio tag.
				</audio>
			</div>
			<div className="row d-flex justify-content-center">
				<div className="playList-container col-lg-8 col-md-12 col-sm-12 p-0">
					<ol className="playList list-unstyled">
						{listSongData.map(function(dataSong, i) {
							return (
								<li key={i}>
									<button
										className="song-btn w-100 py-2 text-left"
										style={
											currentSong == i
												? {
														backgroundColor:
															"rgba(76,76,77,255)"
												  }
												: null
										}
										onClick={() =>
											handleChangeClickedSong(i)
										}>
										<span className="song-id">
											{i + 1 + " "}
										</span>
										<span>
											<i className="fas fa-play hide-play"></i>
										</span>
										{dataSong.name}
									</button>
								</li>
							);
						})}
					</ol>
				</div>
				<div className="d-flex justify-content-center fixed-bottom">
					<div className="controls-container col-lg-8 col-md-12 col-sm-12 d-flex flex-row justify-content-center align-items-center">
						<div className="previous-song col-3">
							<button
								className="btn-controls"
								onClick={handleChangePreviousSong}>
								<i className="fas fa-caret-left fa-2x"></i>
							</button>
						</div>
						<div className="pause-play-song col-3">
							{!playingSong ? (
								<button
									className="btn-controls"
									onClick={handlePlaySong}>
									<i className="fas fa-play"></i>
								</button>
							) : (
								<button
									className="btn-controls"
									onClick={handlePauseSong}>
									<i className="fas fa-pause"></i>
								</button>
							)}
						</div>
						<div className="next-song col-3">
							<button
								className="btn-controls"
								onClick={handleChangeNextSong}>
								<i className="fas fa-caret-right fa-2x"></i>
							</button>
						</div>
					</div>
					z
				</div>
			</div>
		</div>
	);
}
