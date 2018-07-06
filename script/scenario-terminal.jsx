
// Shit for testing
var sceneId = 1;
const testData = {
  scenario: {
    title: 'Adventure #4'
  },
  tracks: [
    { id:1, title: 'Camping in a Dungeon', url: 'media/camping-in-a-dungeon.mp3' },
    { id:2, title: 'Exploring a Cave', url: 'media/exploring-a-cave.mp3' },
    { id:3, title: 'Fighting Goblins', url: 'media/fighting-goblins.mp3' },
    { id:4, title: 'Traveling in Forest', url: 'media/traveling-in-forest.mp3' },
    { id:5, title: 'Camping in Forest', url: 'media/camping-in-forest.mp3' },
    { id:6, title: 'Exploring a Crypt', url: 'media/exploring-a-crypt.mp3' },
    { id:7, title: 'Fighting Orcs', url: 'media/fighting-orcs.mp3' },
    { id:8, title: 'Chased in a Dungeon', url: 'media/chased-in-a-dungeon.mp3' },
    { id:9, title: 'Fighting Beasts', url: 'media/fighting-beasts.mp3' },
    { id:10, title: 'Shopping in a City Market', url: 'media/shopping-in-a-city-market.mp3' }
  ]
};
testData.scenes = [{
  id: sceneId++,
  text: 'Wandering through a forest.',
  track: testData.tracks[3]
},{
  id: sceneId++,
  text: 'Fighting wolves.',
  track: testData.tracks[8]
},{
  id: sceneId++,
  text: 'Uncovering an ancient tomb.',
  track: testData.tracks[5]
},{
  id: sceneId++,
  text: 'Defending against orcs.',
  track: testData.tracks[6]
}];

const api = {
  tracks: new MockApiEndpoint('/api/tracks', testData.tracks),
  scenes: new MockApiEndpoint('/api/scenes', testData.scenes)
};

// Class starts here
class ScenarioTerminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({
      terminalText: '',
      playing: false,
      scenario: testData.scenario,
      selectedScene: null,
      scenes: testData.scenes,
      activeScene: testData.scenes[0],
      tracks: []
    }, props);
  }
  onTerminalUpdate(e) {
    this.setState({ terminalText: e.target.value });
  }
  sendCommand(e) {
    const command = this.state.terminalText;
    this.state.scenes.push({id: sceneId++, text: command});
    this.setState({
      terminalText: ''
    });
    e.preventDefault();
  }
  onSceneClick(scene) {
    this.setState(prev => prev.selectedScene === scene ? { selectedScene: null } : {selectedScene: scene});
  }
  deleteScene(scene) {
    const index = this.state.scenes.remove(scene);
    if (this.state.activeScene === scene) {
      this.skipNext();
    } else {
      this.forceUpdate();
    }
  }
  pause() {
    this.state.playing = false;
    this.updateAudio();
  }
  togglePlay(scene) {
    this.setState(prev => scene !== undefined ? { activeScene: scene, playing: prev.activeScene != scene } : { playing: !prev.playing} );
  }
  next() {
    const scenes = this.state.scenes, index = scenes.indexOf(this.state.activeScene)+1;
    return index < scenes.length ? scenes[index] : null;
  }
  previous() {
    const scenes = this.state.scenes, index = scenes.indexOf(this.state.activeScene)-1;
    return index < scenes.length ? scenes[index] : null;
  }
  skipNext() {
    this.setState({ activeScene: this.next() });
  }
  skipPrevious() {
    this.setState({ activeScene: this.previous() });
  }
  updateAudio() {
    const scene = this.state.activeScene,
          trackUrl = scene && scene.track && scene.track.url,
          audio = this.state.audio,
          playing = this.state.playing,
          sameTrack = audio && audio.currentSrc.endsWith(trackUrl);
    if (audio && (!playing || !sameTrack)) {
        audio.pause();
    }
    if (playing) {
      if (!trackUrl)
        this.state.audio = null;
      else if (!sameTrack) {
        this.state.audio = new Audio(trackUrl);
        this.state.audio.play();
        this.state.audio.loop = true;
      }
    }
  }
  render() {
    this.updateAudio();
    return (
      <div className="app-window">
        <header className="menu-group">
          <nav className="menu app-menu">
            <button disabled className="material-icons">settings</button>
          </nav>
          <div className="scenario">
            {this.state.scenario.title}
          </div>
          <nav className="menu playback">
            <button className="material-icons" disabled={!this.previous()} onClick={this.skipPrevious.bind(this)}>skip_previous</button>
            <button className="material-icons" onClick={e => this.togglePlay()}>{this.state.playing ? 'pause' : 'play_arrow'}</button>
            <button className="material-icons" disabled={!this.next()} onClick={this.skipNext.bind(this)}>skip_next</button>
          </nav>
        </header>
        <main>
          <ul>
            {this.getScenesHtml()}
          </ul>
          <form onSubmit={this.sendCommand.bind(this)}>
            <input 
              type="text"
              className="terminal"
              placeholder="type here..."
              value={this.state.terminalText}
              onChange={this.onTerminalUpdate.bind(this)} />
          </form>
        </main>
      </div>
    );
  }

  getScenesHtml() {
    return this.state.scenes.map(scene => (
      <li key={scene.id} className={(scene == this.state.activeScene && 'active' || '') + ' ' + (scene == this.state.selectedScene && 'selected' || '')}>
        <a href="javascript:void(0)" onClick={e => this.onSceneClick(scene)}>{scene.text}</a>
        <div className="details">
          <div className="menu-group">
            <nav className="menu">
              <button className="material-icons" onClick={e => this.togglePlay(scene)}>
                {this.state.activeScene == scene ? (this.state.playing ? 'pause' : 'play_arrow') : 'play_arrow'}
              </button>
            </nav>
            <nav className="menu">
              <button className="material-icons" onClick={e => this.deleteScene(scene)}>delete</button>
            </nav>
          </div>
          <div className="tags">
            <Link to={location.pathname+'scene/'+scene.id+'/track'} onClick={e => this.pause()}>
              <i className="material-icons">music_note</i>{scene.track ? scene.track.title : '(silence)'}
            </Link>
          </div>
        </div>
      </li>
    ));
  }

}