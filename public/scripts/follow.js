/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addFollow(fields) {
  fetch('/api/follow', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeFollow(fields) {
  fetch(`/api/follow/${fields.id}`, {
    method: 'DELETE',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function getFollowers(fields) {
  fetch(`/api/follow/getFollowers/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function getFollowing(fields) {
  fetch(`/api/follow/getFollowing/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function getFollowingFeed(fields) {
  fetch(`/api/follow/feed/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}
