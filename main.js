"use strict";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favoriteStories = $("#favorite-stories-list");
const $userStories = $("#my-stories-list");
const $storiesContainer = $("#stories-container");
const $storiesLists = $(".stories-list");


const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $submitStoryForm = $("#submit-story-form");
const $navSubmitStory = $("#nav-submit-story");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

function hidePageComponents() {
  const components = [
    $storiesLists,
    $submitStoryForm,
    $loginForm,
    $signupForm,
    
  ];
  components.forEach(c => c.hide());
}

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

$(start);
