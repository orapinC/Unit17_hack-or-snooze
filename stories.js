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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // show favorite star if a user is logged in
    const showStar = Boolean(currentUser);
  
  return $(`
      <li id="${story.storyId}">
        <div>
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
//add star in front of stories
function makeStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starStyle = isFavorite ? "fas" : "far";
  return `<span classs="star">
            <i class="${starStyle} fa-star"> </i>
  </span>`;
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

// handle favorite/un-favorite a story
async function toggleFavoriteStory(evt){
  console.debug("toggleFavor");
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($target.hasClass("fas")){
    await currentUser.deleteFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}
$storiesLists.on("click", ".star", toggleFavoriteStory);

