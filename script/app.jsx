class BardlyTerminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({
      terminalText: '',
      playing: false,
      scenario: null,
      selectedScene: null,
      scenes: new TreeNode(),
      tracks: []
    }, props);
    this.state.activeScene = this.state.scenes;
  }
  onTerminalUpdate(e) {
    this.setState({ terminalText: e.target.value });
  }
  sendCommand(e) {
    const command = this.state.terminalText;
    this.setState({
      scenes: this.state.scenes.append({text: command}),
      terminalText: ''
    });
    e.preventDefault();
  }
  onSceneClick(scene) {
    this.setState(prev => prev.selectedScene === scene ? { selectedScene: null } : {selectedScene: scene});
  }
  deleteScene(scene) {
    if (this.state.activeScene === scene) {
      this.state.activeScene = scene.parent();
    }
    scene.remove();
    this.forceUpdate();
  }
  togglePlay(scene) {
    const playing = this.state.playing;
    scene = scene || this.state.activeScene;
    this.setState({ activeScene: scene, playing: !playing });
  }
  skipNext() {
    this.setState({ activeScene: this.state.activeScene.firstChild() });
  }
  skipPrevious() {
    this.setState({ activeScene: this.state.activeScene.parent() });
  }
  updateAudio() {
    const scene = this.state.activeScene,
          trackUrl = scene && scene.track && scene.track.url, 
          audio = this.state.audio, 
          playing = this.state.playing,
          sameTrack = audio && audio.currentSrc.endsWith(trackUrl);
    if (audio) {
      if (!playing)
        audio.pause();
      else if (!trackUrl || !sameTrack) {
        audio.pause();
      }
    }
    if (playing) {
      if (!trackUrl)
        this.state.audio = null;
      else if (!sameTrack) {
        this.state.audio = new Audio(trackUrl);
        this.state.audio.play();
      }
    }
  }
  render() {
    this.updateAudio();
    return (
      <div className="app">
        <div className="app-header menu-group">
          <nav className="menu app-menu">
            <button className="material-icons">settings</button>
          </nav>
          <div className="scenario">
            {this.state.scenario.title}
          </div>
          <nav className="menu playback">
            <button className="material-icons" disabled={!this.state.activeScene.parent()} onClick={e => this.skipPrevious()}>skip_previous</button>
            <button className="material-icons" onClick={e => this.togglePlay()}>{this.state.playing ? 'pause' : 'play_arrow'}</button>
            <button className="material-icons" disabled={!this.state.activeScene.firstChild()} onClick={e => this.skipNext()}>skip_next</button>
          </nav>
        </div>
        <main className="terminal-window">
          <ul className="scenes">
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
    return this.state.scenes.map((scene, i) => (
      <li key={i} className={(scene == this.state.activeScene && 'active' || '') + ' ' + (scene == this.state.selectedScene && 'selected' || '')}>
        <div className="text" onClick={e => this.onSceneClick(scene)}>{scene.text}</div>
        <div className="details">
          <div className="menu-group">
            <nav className="menu">
              <button className="material-icons" onClick={e => this.togglePlay(scene)}>
                {this.state.activeScene === scene ? (this.state.playing ? 'pause' : 'play_arrow') : 'play_arrow'}
              </button>
            </nav>
            <nav className="menu">
              <button className="material-icons" onClick={e => this.deleteScene(scene)}>delete</button>
            </nav>
          </div>
          <div className="tags">
            <span className="tag"><i className="material-icons">music_note</i> {scene.track ? scene.track.title : '(silence)'}</span>
          </div>
        </div>
      </li>
    ));
  }

}