class BardlyPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      playList: [],
      index: -1,
      tracks: props.tracks
    };
  }
  playTrack(track) {
    this.suspend();
    this.play(track);
    const playList = this.state.playList, index = this.state.index+1;
    this.setState(Object.assign(this.state, {
      playing: true,
      playList: playList ? [...playList.slice(0, index), track, ...playList.slice(index)] : [track],
      index: index
    }));
  }
  play(track) {
    if (track.url) {
      if (!track.audio)
        track.audio = new Audio(track.url);
      track.audio.play();
    }
  }
  addTrack(track) {
    this.setState(Object.assign(this.state, {
      playList: this.state.playList.concat([track])
    }));
  }
  currentTrack() {
    return this.state.playList[this.state.index];
  }
  togglePlay() {
    if (this.currentTrack().audio) {
      if (this.state.playing)
        this.currentTrack().audio.pause();
      else
        this.currentTrack().audio.play();
    }
    this.setState(Object.assign(this.state, {
      playing: !this.state.playing
    }));
  }
  suspend() {
    if (this.currentTrack() && this.currentTrack().audio)
      this.currentTrack().audio.pause();
  }
  next() {
    if (this.state.playing) {
      this.suspend();
      this.play(this.state.playList[this.state.index+1]);
    }
    this.setState(Object.assign(this.state, {
      index: this.state.index+1
    }));
  }
  previous() {
    if (this.state.playing) {
      this.suspend();
      this.play(this.state.playList[this.state.index-1]);
    }
    this.setState(Object.assign(this.state, {
      index: this.state.index-1
    }));
  }
  render() {
    return (
      <div className="app">
        <h1 className="logo">Bardly</h1>
        <TrackPicker
          tracks={this.state.tracks}
          playTrack={this.playTrack.bind(this)}
          addTrack={this.addTrack.bind(this)}
        />
        <section className="bottom-panel">
          <Playback
            togglePlay={this.togglePlay.bind(this)}
            playing={this.state.playing}
            currentTrack={this.state.playList[this.state.index]}
            nextTrack={this.state.playList[this.state.index+1]}
            index={this.state.index}
            hasNext={this.state.playList[this.state.index+1]}
            hasPrevious={this.state.playList[this.state.index-1]}
            next={this.next.bind(this)}
            previous={this.previous.bind(this)}
          />
        </section>
      </div>
    );
  }
}

function Playback(props) {
  return (
    <div className="playback">
      <div className="buttons">
        <button className="material-icons" disabled={!props.hasPrevious} onClick={props.previous}>skip_previous</button>
        <button className="material-icons" disabled={!props.currentTrack} onClick={props.togglePlay}>{props.playing ? 'pause' : 'play_arrow'}</button>
        <button className="material-icons" disabled={!props.hasNext} onClick={props.next}>skip_next</button>
      </div>
      <div className="status">Currently Playing: <span>{props.currentTrack && props.currentTrack.title}</span></div>
      <div className="status">Up Next: <span>{props.nextTrack && props.nextTrack.title}</span></div>
    </div>
  );
}

function TrackPicker(props) {
  const tracksHtml = props.tracks.map(track => (
    <li
      key={track.title} >
      <div className="title">{track.title}</div>
      <div className="buttons">
        <i className="material-icons" onClick={() => props.playTrack(track)}>play_arrow</i>
        <i className="material-icons" onClick={() => props.addTrack(track)}>playlist_add</i>
      </div>
    </li>
  ));
  return (
    <div className="track-picker">
      <ul className="track-list">
        {tracksHtml}
      </ul>
    </div>
  );
}

// ========================================
const tracks = [
  {
    title: 'Wandering in a Forest',
    url: 'https://freesound.org/data/previews/328/328296_1661766-lq.mp3'
  },
  {
    title: 'Fighting Goblins',
    url: 'https://freesound.org/data/previews/192/192072_3482490-lq.mp3'
  },
  {
    title: 'Drinking in a Tavern',
    url: 'https://freesound.org/data/previews/144/144139_2041615-lq.mp3'
  },
  {
    title: 'Camping in a Field'
  },
  {
    title: 'Shopping at the Market'
  },
  {
    title: 'Slaying a Dragon'
  }
];

ReactDOM.render(
  <BardlyPlayer tracks={tracks} />,
  document.getElementById('root')
);