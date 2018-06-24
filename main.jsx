
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