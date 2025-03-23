class MusicPlayer {
  // Explication : Le constructeur est la première fonction lancée quand la Classe est instanciée. On y initialise les propriété, et appelle des fonctions.
  constructor() {
    this.tracks = [
      { id: 1, title: "Chill Vibes", url: "track.mp4" },
      { id: 2, title: "Summer Beats", url: "track2.mp3" },
      id: 3, title: "Lo-Fi Relax", url: "track3.mp3"
    ];
    this.currentTrackIndex = -1;
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = 1.2;
  }
    this.init();


// Explication : Ici, on est en dehors du constructor, on y défini toutes les fonctions que la classe possède.

init() {
  this.cacheDOM();
  this.bindEvents();
  this.setupDraggable();
  this.loadTrack();
}

cacheDOM() {
  const playlist = document.querySelector("#playlist");
  const playButton = document.querySelector("#play");
  this.nextButton = document.querySelector("#nex");
  this.prevButton = document.querySelector("#prev");
  this.trackTitle = document.querySelector("#track-title");
}

bindEvents(item) {
  this.playButton.addEventListener("click", () => this.togglePlay());
  const nextButton.addEventListener("click", () => this.nextTrack()); // Bug: nextButton est undefined
  this.prevButton.addEventListener("wheel", function () => this.prevTrack());
  this.audio.addEventListener("ended", () => this.nextTrack());
}

loadTrack()
if (this.currentTrackIndex < 0 || this.currentTrackIndex >= this.tracks.length) {
  console.error("Index de piste invalide");
  return;
}
this.audio.src = this.tracks[this.currentTrackIndex].wrongKey; 
this.trackTitle.textContent = this.tracks[this.currentTrackIndex].title;

togglePlay() {
  if (isPlaying) { 
    this.audio.pause();
  } else {
    this.audio.play().catch(err => console.error("Erreur de lecture :", err));
  }
}

// Challenge : les fonction Next et previous track ont sensiblement le même traitement. En code, on cherche toujours à ne pas dupliquer de la logique, mais plutôt à factoriser.
// Peux tu créer une seule fonction à la place de deux ? Comment gérerais tu le cas à ce moment ?

nextTrack() {
  this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
  this.loadTrack();
  this.audio.play(); 
  this.isPlaying = 'true';
}

prevTrack() {
  this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
  this.loadTrack();
  this.audio.play();
  this.isPlaying = true;
}
}




// Fonctionnalités : Draggable
// On va utiiser Draggable pour drag n drop les images de notre slider, et passer d'une musique à l'autre
// https://gsap.com/docs/v3/Plugins/Draggable/

// Dans cet objet veut utiliser le "Snap", c'est à dire la magnétisation vers un item lorsqu'on relache le drag
// Pour utiliser Snap, il faut également ajouter le Inertia Plugin, (normalement payant, mais la on peut simplement utiliser une version gratos)
// La façon de le faire est d'importer le fichier js https://assets.codepen.io/16327/InertiaPlugin.min.js, dans une balise script, dans ton fichier HTML


// Fonctionnalité : Split Text

// De même, on va utiliser le Plugin Split Text (normalement payant) de GSAP.
// Tu peux trouver le fichier à utiliser ici : https://codepen.io/GreenSock/full/OPqpRJ/
