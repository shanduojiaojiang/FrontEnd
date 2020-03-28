import React, { useEffect } from 'react'
import { connectWithRedux, setup } from '../../../Utils'
import { util } from 'utils'

function PlaylistView({
  playlists,
  playlist,
  currPlaylist,
  setCurrPlaylist,
}) {

  useEffect(() => {
    util.scrollToCenter(
      '#'+currPlaylist.id, 
      true, 
      util.scrollToTop('.watch-videos-list')
    )
  }, [currPlaylist])

  const handlePlaylistClick = id => async () => {
    setCurrPlaylist({})
    let data = await setup.getPlaylist(id)
    setCurrPlaylist(data)
  }

  return (
    <div className="watch-playlists-list">
      <div className="watch-list-title"><p>Playlists</p></div>
      <div role="list" className="w-100 d-flex flex-column">
        {playlists.map( playlistItem => (
          <button 
            id={playlistItem.id}
            key={playlistItem.id}
            className="watch-playlist-item plain-btn" 
            role="listitem"
            onClick={handlePlaylistClick(playlistItem.id)}
            current={Boolean(playlist.id === playlistItem.id).toString()}
            active={Boolean(currPlaylist.id === playlistItem.id).toString()}
          >
            <i className="material-icons library-icon">video_library</i>
            <div className="playlist-name">
              {playlistItem.name}
              {playlist.id === playlistItem.id && <><br/><span>Current Playlist</span></>}
            </div>
            <i className="material-icons right-arrow">chevron_right</i>
          </button>
        ))}
      </div>
    </div>
  )
}

export default connectWithRedux(
  PlaylistView,
  ['playlists', 'playlist'],
  []
)
