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

function viewLikesByFreetId(fields) {
  fetch(`/api/likes?parentId=${fields.parentId}`)
    .then(showResponse)
    .catch(showResponse);
}
