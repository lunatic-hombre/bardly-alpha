
const tracks = [
  { title: 'Camping in a Dungeon', url: 'media/camping-in-a-dungeon.mp3' },
  { title: 'Exploring a Cave', url: 'media/exploring-a-cave.mp3' },
  { title: 'Fighting Goblins', url: 'media/fighting-goblins.mp3' },
  { title: 'Traveling in Forest', url: 'media/traveling-in-forest.mp3' },
  { title: 'Camping in Forest', url: 'media/camping-in-forest.mp3' },
  { title: 'Exploring a Crypt', url: 'media/exploring-a-crypt.mp3' },
  { title: 'Fighting Orcs', url: 'media/fighting-orcs.mp3' },
  { title: 'Chased in a Dungeon', url: 'media/chased-in-a-dungeon.mp3' },
  { title: 'Fighting Beasts', url: 'media/fighting-beasts.mp3' },
  { title: 'Shopping in a City Market', url: 'media/shopping-in-a-city-market.mp3' }
];

ReactDOM.render(
  <BardlyPlayer tracks={tracks} />,
  document.getElementById('root')
);