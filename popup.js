document.addEventListener('DOMContentLoaded', function() {
  const sendButton = document.getElementById('send');
  sendButton.addEventListener('click', send);

  // Try to find track info
  const checkButton = document.getElementById('check');
  checkButton.addEventListener('click', check);

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // Set videoId
    const videoId = url.match(/(?<=v=)[^&]+/g);
    const input = document.getElementById('video-id');
    input.value = videoId;
  });

  openMetadata();
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
};

const openInfo = () => {
  // Show video details
  const moreButton = document.getElementsByClassName('more-button style-scope ytd-video-secondary-info-renderer')[0];
  moreButton.click();
};

const modifyDOM = () => {
  const unfiltered_metadataTags = document.getElementsByClassName('style-scope ytd-metadata-row-renderer');
  const filtered_metadataTags = [];
  for ( let tag of unfiltered_metadataTags ) {
    if ( tag.tagName === 'YT-FORMATTED-STRING' ) {
      filtered_metadataTags.push(tag.innerHTML.toString().trim());
    }
  }

  const metadata = {};

  for ( let i = 0; i < filtered_metadataTags.length - 1; i++ ) {
    if ( filtered_metadataTags[i] === 'Song' ) {
      if ( filtered_metadataTags[i + 1].match(/^<a/g) ) {
        metadata.name = filtered_metadataTags[i + 1].match(/(?<=>)[^<]+/g)[0];
      } else {
        metadata.name = filtered_metadataTags[i + 1];
      }
    }

    else if ( filtered_metadataTags[i] === 'Artist' ) {
      if ( filtered_metadataTags[i + 1].match(/^<a/g) ) {
        metadata.artist = filtered_metadataTags[i + 1].match(/(?<=>)[^<]+/g)[0];
      } else {
        metadata.artist = filtered_metadataTags[i + 1].toString();
      }
    }

    else if ( filtered_metadataTags[i] === 'Album' ) {
      if ( filtered_metadataTags[i + 1].match(/^<a/g) ) {
        metadata.album = filtered_metadataTags[i + 1].match(/(?<=>)[^<]+/g)[0];
      } else {
        metadata.album = filtered_metadataTags[i + 1];
      }
    }
  }

  return metadata;
}

const check = () => {
  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')();'
  }, metadata => {
    if ( metadata[0].name ) document.getElementById('name').value = metadata[0].name;
    if ( metadata[0].artist ) document.getElementById('artist').value = metadata[0].artist;
    if ( metadata[0].album ) document.getElementById('album-title').value = metadata[0].album;
  });
};

const openMetadata = () => {
  chrome.tabs.executeScript({
    code: '(' + openInfo + ')();'
  }, () => {})
};