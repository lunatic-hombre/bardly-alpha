class TrackPicker extends React.Component {
  
  constructor(props) {
  	super();
  	this.state = Object.assign({
  		sceneId: null 
  	}, props.match.params);
  	
  	if (!this.state.sceneId) {
  		throw 'sceneId undefined';
  	}

  	this.load();
  }

  async load() {
  	let scene = await api.scenes.get(this.state.sceneId), 
  		  tracks = await api.tracks.list();
  	this.setState({
  		scene: scene,
  		tracks: tracks
  	});
  }

  setTrack(track) {
    this.state.scene.track = track;
    this.forceUpdate();
  }

  save() {
    this.state.scene.save();
  }
  
  render() {
    return (
      <div className="app-window">
        <header className="centered">
          Choose a Track
        </header>
        <main className="terminal-window">
          <ul className="scenes">
            {this.getTracksHtml()}
          </ul>
        </main>
        <footer>
          <Link to="/">Cancel</Link>
          <Link to="/" onClick={e => this.save()}>Confirm</Link>
        </footer>
      </div>
    );
	}

	getTracksHtml() {
			if (this.state.tracks) {
				return this.state.tracks.map(track => (<li className={this.state.scene.track == track ? 'selected' : ''}>
          <a href="javascript:void(0)" onClick={e => this.setTrack(track)}>{track.title}</a>
        </li>));
			}
			return 'Loading...';
	}

}