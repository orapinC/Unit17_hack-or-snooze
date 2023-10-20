"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBin = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // show favorite star if a user is logged in
    const showStar = Boolean(currentUser);
  
  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteBin ? makeBinHTML() : ""}
        ${showStar ? makeStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
    $allStoriesList.show();
}
/** Handle submit new story form */
async function submitAndDisplayStories(evt){
  console.log("submitAndDisplayStories");
  evt.preventDefault();

  //grab the story author, title, and url
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  // put the new account owner story to the first on the story list
  const story = await storyList.addStory(currentUser,{author, title, url});

  //add the new story to html to display
    const $story = generateStoryMarkup(story);
    $allStoriesList.prepend($story);
  
  //slideUp & reset story submit form
  //***note to self:
  //slideUp == JQuery's method
  //-------animates the height of the matched elements.
  //-------This causes lower part of the page to slide up,
  //-------appearing to conceal the items.
  //trigger("reset") = JQuery's method
  //-------similar to JS's reset() method
  $submitStoryForm.slideUp("slow");
  $submitStoryForm.trigger("reset");
}
$submitStoryForm.on("submit", submitAndDisplayStories);


function makeStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starStyle = isFavorite ? "fas" : "far";
  return `<span class="star">
            <i class="${starStyle} fa-star"> </i>
  </span>`;
}

// handle favorite/un-favorite a story
async function toggleFavoriteStory(evt){
  console.debug("toggleFavoriteStory");
  
  //console.debug(evt.target);
  const $target = $(evt.target);
  console.debug("test");
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($target.hasClass("fas")){
    await currentUser.unFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}
$allStoriesList.on("click", ".star", toggleFavoriteStory);

function putFavoritesOnPage() {
  $favoriteStories.empty();
  if (currentUser.favorites.length === 0){
    $favoriteStories.append("<h5>No favorite story chosen!</h5>");
  } else {
    for (let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}

function putUserStoriesOnPage(){
  console.debug("putUserStoriesOnPage");
  $userStories.empty();
  if (currentUser.ownStories.length === 0){
    $userStories.append("<h5>No user added story!<h5>");
  } else {
    for (let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story, true);
      $userStories.append($story);
    }
  }
  $userStories.show();
}

function makeBinHTML() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>`;
}

async function deleteUserStory(evt){
  console.debug('deleteUserStory');
  //get storyId
  const closestLi = $(evt.target).closest("li").get();
  const storyId = closestLi[0].id;
  await storyList.removeUserStory(currentUser, storyId);
  putUserStoriesOnPage();
}
$userStories.on("click", ".trash-can", deleteUserStory);