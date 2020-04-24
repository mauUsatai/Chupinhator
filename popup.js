document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('button');
  button.addEventListener('click', send);

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;

    // Set videoId
    const videoId = url.match(/(?<=v=)[^&]+/g);
    const input = document.getElementById('video-id');
    input.value = videoId;

});
}, false);

const send = () => {
  const videoID = document.getElementById('video-id').value;
  const name = document.getElementById('name').value;
  const artist = document.getElementById('artist').value;
  const albumTitle = document.getElementById('album-title').value;
  
  const payload = {
    videoID: videoID,
    name: name,
    artist: artist,
    albumTitle: albumTitle
  };

  axios.post('http://localhost:3001/song', payload)
    .then(res => alert('Added!'))
    .catch(err => alert(err));

  alert('Adding drop. This can take a while...');
}