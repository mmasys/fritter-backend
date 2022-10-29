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
