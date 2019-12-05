import 'bulma'
import './style.scss'

import * as mm from '@magenta/music'

const musicRNN= new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn')


let started = false


const  TWINKLE_TWINKLE = {
  notes: [
    {pitch: 60, startTime: 0.0, endTime: 0.5},
    {pitch: 60, startTime: 0.5, endTime: 1.0},
    {pitch: 67, startTime: 1.0, endTime: 1.5},
    {pitch: 67, startTime: 1.5, endTime: 2.0},
    {pitch: 69, startTime: 2.0, endTime: 2.5},
    {pitch: 69, startTime: 2.5, endTime: 3.0},
    {pitch: 67, startTime: 3.0, endTime: 4.0},
    {pitch: 65, startTime: 4.0, endTime: 4.5},
    {pitch: 65, startTime: 4.5, endTime: 5.0},
    {pitch: 64, startTime: 5.0, endTime: 5.5},
    {pitch: 64, startTime: 5.5, endTime: 6.0},
    {pitch: 62, startTime: 6.0, endTime: 6.5},
    {pitch: 62, startTime: 6.5, endTime: 7.0},
    {pitch: 60, startTime: 7.0, endTime: 8.0}
  ],
  totalTime: 8
}


const rnnSteps = 20
const rnnTemperature = 1.5



function generate(input){
  const qns = mm.sequences.quantizeNoteSequence(input, 4)
  musicRNN
    .continueSequence(qns, rnnSteps, rnnTemperature)
    .then((sample) => {

      for(let i=0;i<sample.notes.length;i++){
        if(i%2===0){
          sample.notes[i].isDrum = false
        }
      }

      const config = {
        noteHeight: 20,
        pixelsPerTimeStep: 100,  // like a note width
        noteSpacing: 10,
        noteRGB: `${Math.random()*255},${Math.random()*255},${Math.random()*255}`,
        activeNoteRGB: '240, 84, 119'
      }

      const  viz = new mm.PianoRollCanvasVisualizer(sample, document.getElementById('canvas'), config)
      console.log(viz.config.noteHeight)
      console.log(viz)



      const vizPlayer = new mm.Player(false, {
        run: (sample) => viz.redraw(sample, true),
        stop: () => {
          console.log('done')
          generate(sample)
        }

      })

      vizPlayer.start(sample)


    })
}

const can = document.getElementById('canvas')
var ctx = can.getContext('2d')
ctx.globalAlpha = 1
ctx.fillStyle = 'black'
ctx.fillRect(0, 0, can.width, can.height)
ctx.fillStyle = 'white'
ctx.font = '80px Helvetica'
ctx.fillText('Click', can.width/2, can.height/2)



function start(){
  if(!started){
    started = true
    ctx.clearRect(0, 0, can.width, can.height)
    ctx.globalAlpha = 0.1
    ctx.fillStyle = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
    ctx.fillRect(0, 0, can.width, can.height)
    can.classList.add('spin')
    generate(TWINKLE_TWINKLE)
  }

}


can.addEventListener('click', function () {

  start()
})
