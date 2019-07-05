import React from 'react';
// import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import './video.css'

// UIs
import { Header, Player } from './Components'
// import PlaylistBar from './playlist'
import './index.css';
// Vars
import { api } from '../../util'
// import { fakeData } from '../../data'
// const course = fakeData.instData.courses[0];
// const offering = {
//   num: course.num,
//   name: course.name,
//   depart: course.department,
//   description: course.description,
//   term: course.offerings[0].term,
//   sec: course.offerings[0].sec,
//   playlists: fakeData.playlists,
// }

const videoJsOptions = {
  autoplay: false,
  controls: true,
  sources: [{
    src:  '//d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4',// https:'media.w3.org/2010/05/sintel/trailer_hd.mp4',
    type: 'video/mp4'
  }],

  // poster: 'http://videojs.com/img/logo.png',
  fluid: true, // put the player in the VideoPlayerWrap box
  responsive: true,
  playbackRates: [0.5, 1, 1.25, 1.5, 1.75, 2],
  controlBar: {
    volumePanel: {
      inline: true // vertical VolumeControl
    }
  },
  // nativeTextTracks: true,
  // Using A Plugin
  plugins: {
    setStateandFocusPlugin: true
  }
}


export class VideoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    /**
     * Hide the loading page
     */
    api.contentLoaded()
  }
  

  render() {
  
    // Registering A Plugin
    return (
      <div className="video-page">
        <Header 
          goBack={()=>this.props.history.goBack()}
          {...this}
        />
        
        <Player {...videoJsOptions}/>  
      </div>
    )
  }
}
