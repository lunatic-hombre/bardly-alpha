class TrackPicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: props.tracks,
      filteredTracks: props.tracks
    };
    this.playTrack = props.playTrack;
    this.addTrack = props.addTrack;
  }

  onSearch(event) {
    const searchString = event.target.value && event.target.value.toLowerCase();
    if (!searchString) {
      if (this.state.tracks !== this.state.filteredTracks) {
        this.setState(Object.assign(this.state, {
          filteredTracks: this.state.tracks
        }));
      }
      return;
    }
    this.setState(Object.assign(this.state, {
      filteredTracks: this.state.tracks.filter(track => track.title.toLowerCase().includes(searchString))
    }));
  }

  render() {
    const tracksHtml = this.state.filteredTracks.map(track => (
      <li key={track.title} >
        <div className="title">{track.title}</div>
        <div className="buttons">
          <i className="material-icons" onClick={() => this.playTrack(track)}>play_arrow</i>
          <i className="material-icons" onClick={() => this.addTrack(track)}>playlist_add</i>
        </div>
      </li>
    ));
    return (
      <div className="track-picker">
        <form className="search">
          <input type="text" size="30" onChange={e => this.onSearch(e)} />
          <button>
            <i className="material-icons">search</i>
          </button>
        </form>
        <ul className="track-list">
          {tracksHtml}
        </ul>
      </div>
    );
  }

}