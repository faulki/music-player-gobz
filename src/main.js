// import { gsap } from "gsap";
    
// import { Draggable } from "gsap/Draggable";

// gsap.registerPlugin(Draggable);

class MusicPlayer {
  // Explication : Le constructeur est la première fonction lancée quand la Classe est instanciée. On y initialise les propriété, et appelle des fonctions.
  constructor() {
    this.tracks = [
      { id: 1, title: "Strobe - Deadmau5", url: "/deadmau5-Strobe.mp3", img: "/deadmau5.jpg" },
      { id: 2, title: "Favé La Mano - No stress", url: "/Favé-&-La-Mano-1.9-No-stress-(Clip-Officiel).mp3", img: "/noStress.jpg" },
      { id: 3, title: "I'm fresh - Thaiboy Digital", url: "/Thaiboy-Digital—Im-Fresh-(Official-Video).mp3", img: "/thaiboy.jpg" }
    ];
    this.currentTrackIndex = 0;
    this.audio = new Audio(this.tracks[0].url);
    this.isPlaying = false;
    this.volume = 1.2;
    this.progress = 0;
    this.init();
  }
// Explication : Ici, on est en dehors du constructor, on y défini toutes les fonctions que la classe possède.

init() {
  console.log("init lancé")
  this.cacheDOM();
  this.bindEvents();
  //this.setupDraggable();
  this.loadTrack();
}

cacheDOM() {
  this.playlist = document.querySelector("#playlist");
  this.playButton = document.querySelector("#play");
  this.nextButton = document.querySelector("#next");
  this.prevButton = document.querySelector("#prev");
  this.trackTitle = document.querySelector("#track-title");
  this.songImage = document.querySelector("#songImage");
  this.currentSongContainer = document.getElementById("currentSongContainer");
  this.background = document.getElementById("backgroundCircle")
  this.progressEl = document.querySelector('input[type="range"]');
  this.mouseDownOnSlider = false;
  this.audio.addEventListener("loadeddata", () => {
    this.progressEl.value = 0;
  });
  this.audio.addEventListener("timeupdate", () => {
    if (!this.mouseDownOnSlider) {
      this.progressEl.value = this.audio.currentTime / this.audio.duration * 100;
    }
  });
  this.progressEl.addEventListener("change", () => {
    const pct = this.progressEl.value / 100;
    this.audio.currentTime = (this.audio.duration || 0) * pct;
  });
  this.progressEl.addEventListener("mousedown", () => {
    this.mouseDownOnSlider = true;
  });
  this.progressEl.addEventListener("mouseup", () => {
    this.mouseDownOnSlider = false;
  });
}

changeBackgroundColor(){
  if(this.currentTrackIndex == 0){
    this.background.style.backgroundColor = "#10cbf5";
  }
  else if(this.currentTrackIndex == 1) {
    this.background.style.backgroundColor = "#c6c1a6";
  }
  else if(this.currentTrackIndex == 2) {
    this.background.style.backgroundColor = "#f7f8fb";
  }
}

bindEvents() {
  this.playButton.addEventListener("click", () => this.togglePlay());
  this.nextButton.addEventListener("click", () => this.nextTrack()); // Bug: nextButton est undefined
  this.prevButton.addEventListener("click", () => this.prevTrack());
  this.audio.addEventListener("ended", () => this.nextTrack());
}

loadTrack() {
if (this.currentTrackIndex < 0 || this.currentTrackIndex >= this.tracks.length) {
  console.error("Index de piste invalide");
  return;
}
this.audio.src = this.tracks[this.currentTrackIndex].url; 
this.trackTitle.textContent = this.tracks[this.currentTrackIndex].title;
this.imgSrc = this.tracks[this.currentTrackIndex].img
this.songImage.src = this.imgSrc
}

togglePlay() {
  if (this.isPlaying) { 
    this.audio.pause();
    this.isPlaying = false;
    this.playButton.textContent = "▶️"
  } else {
    this.audio.play().catch(err => console.error("Erreur de lecture :", err));
    this.isPlaying = true;
    this.playButton.textContent = "⏸️"
  }
}

// Challenge : les fonction Next et previous track ont sensiblement le même traitement. En code, on cherche toujours à ne pas dupliquer de la logique, mais plutôt à factoriser.
// Peux tu créer une seule fonction à la place de deux ? Comment gérerais tu le cas à ce moment ?

nextTrack() {
  this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
  this.loadTrack();
  this.audio.play(); 
  this.isPlaying = true;
  console.log(this.currentTrackIndex);
  this.changeBackgroundColor();
}

prevTrack() {
  this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
  this.loadTrack();
  this.audio.play();
  this.isPlaying = true;
  console.log(this.currentTrackIndex);
  this.changeBackgroundColor();
}

}

// Draggable.create(this.currentSongContainer, {
//   type: "x",
//   inertia: true,
//   onClick: function () {
//     console.log("clicked");
//   },
//   onDragEnd: function () {
//     console.log("drag ended");
//   },
// });

let musicPlayer = new MusicPlayer();


// Fonctionnalités : Draggable
// On va utiiser Draggable pour drag n drop les images de notre slider, et passer d'une musique à l'autre
// https://gsap.com/docs/v3/Plugins/Draggable/

// Dans cet objet veut utiliser le "Snap", c'est à dire la magnétisation vers un item lorsqu'on relache le drag
// Pour utiliser Snap, il faut également ajouter le Inertia Plugin, (normalement payant, mais la on peut simplement utiliser une version gratos)
// La façon de le faire est d'importer le fichier js https://assets.codepen.io/16327/InertiaPlugin.min.js, dans une balise script, dans ton fichier HTML


// Fonctionnalité : Split Text

// De même, on va utiliser le Plugin Split Text (normalement payant) de GSAP.
// Tu peux trouver le fichier à utiliser ici : https://codepen.io/GreenSock/full/OPqpRJ/
