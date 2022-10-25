/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addDisprove(fields) {
  fetch('/api/disproves/addDisprove', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeDisprove(fields) {
  fetch(`/api/disproves/removeDisprove/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function addDisproveLink(fields) {
  fetch(`/api/disproves/addLink/${fields.id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeDisproveLink(fields) {
  fetch(`/api/disproves/removeLink/${fields.id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}
