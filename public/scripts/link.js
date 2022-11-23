/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addApproveLink(fields) {
  fetch(`/api/link/addApproveLink/${fields.freetId}/${fields.url}`, {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeApproveLink(fields) {
  fetch(`/api/link/removeApproveLink/${fields.freetId}/${fields.url}`, {
    method: 'DELETE',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function getMostPopularApproveLinks(fields) {
  fetch(`/api/link/getMostPopularApproveLinks/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function addDisproveLink(fields) {
  fetch(`/api/link/addDisproveLink/${fields.freetId}/${fields.url}`, {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeDisproveLink(fields) {
  fetch(`/api/link/removeDisproveLink/${fields.freetId}/${fields.url}`, {
    method: 'DELETE',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function getMostPopularDisproveLinks(fields) {
  fetch(`/api/link/getMostPopularDisproveLinks/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}
