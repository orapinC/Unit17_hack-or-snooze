"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** submit story form when click submit */
function navSubmitStory(evt){
  console.debug("navSubmitStory", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
}
//---this one not working --$navSubmitStory.on("click", navSubmitStory);
$body.on("click", "#nav-submit-story", navSubmitStory);

// user click "favorites" => show favorite stories
function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$body.on("click", "#nav-favorite-stories", navFavoritesClick);

function navMyStories(evt){
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $userStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories);