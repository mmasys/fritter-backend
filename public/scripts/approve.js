/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addApprove(fields) {
  fetch('/api/approves/addApprove', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeApprove(fields) {
  fetch(`/api/approves/removeApprove/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function addApproveLink(fields) {
  fetch(`/api/approves/addLink/${fields.id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeApproveLink(fields) {
  fetch(`/api/approves/removeLink/${fields.id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function getMostPopularLinks(fields) {
  fetch(`/api/approves/mostPopularLinks/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}
