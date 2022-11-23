/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'add-like': addLike,
  'remove-like': removeLike,
  'find-liked-freets': findLikedFreets,
  'add-approve': addApprove,
  'remove-approve': removeApprove,
  'add-disprove': addDisprove,
  'remove-disprove': removeDisprove,
  'add-approve-link': addApproveLink,
  'remove-approve-link': removeApproveLink,
  'get-most-popular-approve-links': getMostPopularApproveLinks,
  'add-disprove-link': addDisproveLink,
  'remove-disprove-link': removeDisproveLink,
  'get-most-popular-disprove-links': getMostPopularDisproveLinks,
  'add-follow': addFollow,
  'remove-follow': removeFollow,
  'get-followers': getFollowers,
  'get-following': getFollowing,
  'get-following-feed': getFollowingFeed,
  'get-most-popular-freets-feed': getMostPopularFreets,
  'get-most-credible-freets-feed': getMostCredibleFreets,
  'reset-fritter-limit': resetLimit,
  'get-fritter-limit': getLimit,
  'decrement-fritter-limit': decrementLimit
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
