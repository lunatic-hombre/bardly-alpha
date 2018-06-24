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
    playList.splice(index, 0, track);
    this.state.playing = true;
    this.state.index = index;
    this.forceUpdate();
  }
  play(track) {
    if (track.url) {
      if (!track.audio)
        track.audio = new Audio(track.url);
      track.audio.play();
    }
  }
  addTrack(track) {
    this.state.playList.push(track);
    this.forceUpdate();
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
    this.state.playing = playing;
    this.forceUpdate();
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
    this.state.index = this.state.index+1;
    this.forceUpdate();
  }
  previous() {
    if (this.state.playing) {
      this.suspend();
      this.play(this.state.playList[this.state.index-1]);
    }
    this.state.index = this.state.index-1;
    this.forceUpdate();
  }
  render() {
    return (
      <div className="app">
        
        <h1 className="logo">Bardly</h1>
        
        <main>
          <PlayList
            state={this.state}
          />
          <TrackPicker
            tracks={this.state.tracks}
            playTrack={this.playTrack.bind(this)}
            addTrack={this.addTrack.bind(this)}
          />
        </main>

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