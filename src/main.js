import { gsap } from "gsap";
    
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);
gsap.registerPlugin(SplitText) 

class MusicPlayer {
  // Explication : Le constructeur est la première fonction lancée quand la Classe est instanciée. On y initialise les propriété, et appelle des fonctions.
  constructor() {
    this.tracks = [
      { id: 1, title: "Strobe - Deadmau5", url: "/deadmau5-Strobe.mp3", img: "/deadmau5.jpg" },
      { id: 2, title: "Favé La Mano - No stress", url: "/Favé-&-La-Mano-1.9-No-stress-(Clip-Officiel).mp3", img: "/noStress.jpg" },
      { id: 3, title: "I'm fresh - Thaiboy Digital", url: "/Thaiboy-Digital—Im-Fresh-(Official-Video).mp3", img: "/thaiboy.jpg" },
      { id: 4, title: "SALAH MALIKOUM", url: "/salahmalikoum.mp3", img: "/donpollo.jpg" }
    ];
    this.currentTrackIndex = 0;
    this.audio = new Audio(this.tracks[0].url);
    this.isPlaying = false;
    this.volume = 1.2;
    this.progress = 0;
    this.init();
    requestAnimationFrame(this.updatePositions.bind(this))
  }
// Explication : Ici, on est en dehors du constructor, on y défini toutes les fonctions que la classe possède.

init() {
  console.log("init lancé")
  this.cacheDOM();
  this.bindEvents();
  this.setupDraggable();
  this.loadTrack();
  this.textAnimation();
}

cacheDOM() {
  this.playlist = document.querySelector("#playlist");
  this.playButton = document.querySelector("#play");
  this.nextButton = document.querySelector("#next");
  this.prevButton = document.querySelector("#prev");
  this.trackTitle = document.querySelector("#track-title");
  this.songImage = document.querySelector("#songImage");
  this.trackTitleNext = document.getElementById("track-title-next");
  this.songImageNext = document.getElementById("songImageNext");
  this.slider = document.getElementById("slider")
  this.trackTitlePrevious = document.getElementById("track-title-previous");
  this.songImagePrevious = document.getElementById("songImagePrevious");
  this.currentSongContainer = document.getElementById("currentSongContainer");
  this.previousSongContainer = document.getElementById("previousSongContainer");
  this.nextSongContainer = document.getElementById("nextSongContainer");
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
    this.background.style.backgroundColor = "#ffffff";
  }
  else if(this.currentTrackIndex == 3) {
    this.background.style.backgroundColor = "#a16b52";
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

this.trackTitlePrevious.textContent = this.tracks[(this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length].title
this.imgSrcPrevious = this.tracks[(this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length].img
this.songImagePrevious.src = this.imgSrcPrevious;

this.trackTitleNext.textContent = this.tracks[(this.currentTrackIndex + 1) % this.tracks.length].title
this.imgSrcNext = this.tracks[(this.currentTrackIndex + 1) % this.tracks.length].img
this.songImageNext.src = this.imgSrcNext;
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
  this.changeBackgroundColor();
  this.textAnimation();
  this.drag[0].x = 0;
  this.slider.style.transform = "translate3d(0px, 0px, 0px)"
}

prevTrack() {
  this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
  this.loadTrack();
  this.audio.play();
  this.isPlaying = true;
  this.changeBackgroundColor();
  this.textAnimation();
  this.drag[0].x = 0;
  this.slider.style.transform = "translate3d(0px, 0px, 0px)"
}

setupDraggable(){
  this.drag = Draggable.create(this.slider, {
    type: "x",
    inertia: true,
    snap: [-580, 0, 580],
    onThrowComplete: () => {
      if (this.drag[0].x === 580) {
        this.prevTrack();
        console.log("précédent")
      }
      if (this.drag[0].x === -580) {
        this.nextTrack();
        console.log("suivant")       
      }
    },
  });
}

updatePositions(){
  // gsap.set(this.slider, { x: '0'})
  this.currentSongContainer.style.filter = `blur(${Math.abs(-this.drag[0].x / 100)}px)`
  this.currentSongContainer.style.transform = (`scale(${-Math.abs(this.drag[0].x / 1600)+1})`)
  this.currentSongContainer.style.transform = (`translate(0px, ${-Math.abs(this.drag[0].x +200)/ 100})px`)
  this.previousSongContainer.style.filter = `blur(${Math.abs((-this.drag[0].x + 580) / 100)}px)`
  this.nextSongContainer.style.filter = `blur(${Math.abs((-this.drag[0].x - 580) / 100)}px)`
  requestAnimationFrame(this.updatePositions.bind(this))
}

textAnimation(){
  var split = new SplitText(this.trackTitle, {type: "chars"});
//now animate each character into place from 100px above, fading in:
gsap.from(split.chars, {
  duration: 1, 
  y: 50, 
  autoAlpha: 0, 
  stagger: 0.03
});
}

}



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
