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