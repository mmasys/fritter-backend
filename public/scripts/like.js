/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addLike(fields) {
  fetch('/api/likes', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeLike(fields) {
  fetch(`/api/likes/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function findLikedFreets(fields) {
  fetch(`/api/likes?userId=${fields.userId}`)
    .then(showResponse)
    .catch(showResponse);
}
