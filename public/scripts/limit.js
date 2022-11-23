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
  fetch('/api/limit/getLimit')
    .then(showResponse)
    .catch(showResponse);
}

function decrementLimit(fields) {
  fetch('/api/limit/decrementLimit', {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}
