class PlayList extends React.Component {

  constructor(props) {
    super(props);
    this.state = props.state;
  }

  dragStart(e) {
    this.state.dragIndex = parseInt(e.target.attributes.trackIndex.value);

    e.dataTransfer.effectAllowed = 'move';
  }
  
  dragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.target.classList.add('over');
    e.dataTransfer.dropEffect = 'move';

    return false;
  }

  dragEnter(e) {
    // TODO
  }

  dragLeave(e) {
    e.target.classList.remove('over');
  }

  dragDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    const fromIndex = this.state.dragIndex, 
          toIndex = e.target.attributes.trackIndex && e.target.attributes.trackIndex.value;
    if (fromIndex != toIndex) {
      const track = this.state.playList[fromIndex];
      this.state.playList.splice(fromIndex, 1);
      this.state.playList.splice(fromIndex < toIndex ? toIndex - 1 : toIndex, 0, track);
      this.forceUpdate();
    }
    e.target.classList.remove('over');
    
    return false;
  }

  render() {
    const currentIndex = this.state.index,
          tracksHtml = this.state.playList.map((track, index) => (
      <li className={index == currentIndex ? 'current' : ''}
          key={track.title} 
          trackIndex={index}
          draggable="true"
          onDragStart={this.dragStart.bind(this)}
          onDragEnter={this.dragEnter.bind(this)}
          onDragOver={this.dragOver.bind(this)}
          onDragLeave={this.dragLeave.bind(this)}
          onDrop={this.dragDrop.bind(this)}
          onDragEnd={this.dragLeave.bind(this)}>
        <div className="title">{track.title}</div>
        <div className="buttons">
          <i className="material-icons" onClick={() => this.state.playList = this.state.playList.splice(index, 1)}>close</i>
        </div>
      </li>
    ));
    return (
      <div className="play-list">
        <ul>
          {tracksHtml}
        </ul>
      </div>
    );
  }
}