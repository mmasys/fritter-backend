/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addLimit(fields) {
  fetch('/api/limit/initialize', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function resetLimit(fields) {
  fetch('/api/limit/reset', {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function getLimit(fields) {
  fetch('/api/link/getLimit')
    .then(showResponse)
    .catch(showResponse);
}

function decrementTimer(fields) {
  fetch('/api/limit/decrementTimer', {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}
