/* eslint-disable @typescript-eslint/restrict-template-expressions */
function addApproveLinkTwo(fields) {
  fetch(`/api/link/addApproveLink/${fields.freetId}/${fields.url}`, {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function removeApproveLinkTwo(fields) {
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
