const leftScore = document.querySelector(".left_goal_score"); // left side score area
const rightScore = document.querySelector(".right_goal_score"); // right side score area
const leftGoal = document.querySelector(".left_goal_inside"); //  left goal area
const rightGoal = document.querySelector(".right_goal_inside"); // right goal area
const leftGoalBody = document.querySelector(".left_goal_body"); // place to show node copies for the left side
const rightGoalBody = document.querySelector(".right_goal_body"); // place to show node copies for the right side
const dragElArr = document.querySelectorAll(".elements"); // array of all elements(balls) on a field
const dropZoneArr = document.querySelectorAll(".drop_zone"); // array of all drop zones on a field
let leftScoreCount = 0; // score for the left side
let rightScoreCount = 0; // score for the rigth side
let mapHeaderRight = new Map(); // map of node copy elements for the right side
let mapHeaderLeft = new Map(); // map of node copy elements for the left side
let mapBodyRight = new Map(); // map of the original nodes for the right side
let mapBodyLeft = new Map(); // map of the original nodes for the left side

let coordX; // e.offsetX
let coodrY; // e.offsetY
let currEl; // current node element for different functions to use
printScore(); // printing score into the DOM
dragElArr.forEach((el) => {
  // make all nodes draggable
  el.draggable = true;
});
dragElArr.forEach((el) => {
  // different event listeners for elements(balls)
  el.addEventListener("dragstart", onDragStart(el));
  el.addEventListener("dragend", onDragEnd(el));
});
dropZoneArr.forEach((el) => {
  // different event listeners to handle drop zones
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  // for drop in drop zone
  el.addEventListener("drop", onDrop);
});

function onDrop(e) {
  const copy = currEl.cloneNode(true); // node copy that we use to put into a header near the score
  copy.className += " header_ball";
  copy.style.display = "flex";
  copy.style.position = "relative";
  copy.style.top = "0";
  copy.style.left = "0";
  // if drop zone is a right or left goal
  if (e.path[0] === rightGoal || e.path[0] === leftGoal) {
    //  if drop zone is a right goal
    if (e.path[0] === rightGoal) {
      if (mapBodyRight.has(currEl)) {
        // if we move the ball from one corner to another on the same goal
        // nothing to change
        rightScoreCount = rightScoreCount;
      } else {
        // if below to handle situation when we moved from one goal straight to another
        if (mapHeaderLeft.has(currEl)) {
          leftGoalBody.removeChild(mapHeaderLeft.get(currEl));
          mapHeaderLeft.delete(currEl);
          mapBodyLeft.delete(currEl);
          leftScoreCount += -1;
        }
        // code below is adding our node and updating score
        rightScoreCount += 1;
        rightGoalBody.appendChild(copy);
        mapHeaderRight.set(currEl, copy);
        mapBodyRight.set(currEl, currEl);
        printScore();
      }
      //  if drop zone is a left goal
    } else {
      if (mapBodyLeft.has(currEl)) {
        // if we move the ball from one corner to another on the same goal
        // nothing to change
        leftScoreCount = leftScoreCount;
      } else {
        // if below to handle situation when we moved from the left goal straight to right
        if (mapHeaderRight.has(currEl)) {
          rightGoalBody.removeChild(mapHeaderRight.get(currEl));
          mapHeaderRight.delete(currEl);
          mapBodyRight.delete(currEl);
          rightScoreCount += -1;
        }
        // code below is adding our node and updating score
        leftScoreCount += 1;
        copy.className += " header_ball";
        leftGoalBody.appendChild(copy);
        mapHeaderLeft.set(currEl, copy);
        mapBodyLeft.set(currEl, currEl);
        printScore();
      }
    }
    // else below for case if we drop NOT into a right or left goal
  } else {
    // run below code only if we already have some score, and we want to update everything
    if (rightScoreCount > 0 || leftScoreCount > 0) {
      // if we're dragging our node from the right goal
      // the if below will handle this case
      if (mapHeaderRight.has(currEl)) {
        rightScoreCount += -1;
        rightGoalBody.removeChild(mapHeaderRight.get(currEl));
        mapBodyRight.delete(currEl);
        mapHeaderRight.delete(currEl);
        printScore();
      } else {
        // if we're dragging our node from the left goal
        // the if below will handle this case
        if (mapHeaderLeft.has(currEl)) {
          leftScoreCount += -1;
          leftGoalBody.removeChild(mapHeaderLeft.get(currEl));
          mapHeaderLeft.delete(currEl);
          mapBodyLeft.delete(currEl);
          printScore();
        }
      }
    }
  }

  const fieldWidth = document.querySelector(".field_wrapper").offsetWidth; // width of a football field
  const fieldHeight = document.querySelector(".field_wrapper").offsetHeight; // height of a footbal field
  const windowWidth = window.innerWidth; // window width
  const windowHeight = window.innerHeight; // window heigth
  const diffW = (windowWidth - fieldWidth) / 2; // difference in between width we use to calculate while dropping a node(ball)
  const diffH = (windowHeight - fieldHeight) / 2; // difference in between hight we use to calculate while dropping a node(ball)
  const changeY = e.clientY - diffH - coordY - 11 + "px"; // calculated Y difference for the ball
  const changeX = e.clientX - diffW - coordX - 2 + "px"; // calculated X difference for the ball
  currEl.style.top = changeY; // final top distance for the dropped node(ball)
  currEl.style.left = changeX; // final left distance for the dropped node(ball)
  currEl.style.display = "flex";
}
function onDragStart(el) {
  return function (e) {
    e.dataTransfer.setData("text/html", "dragstart");
    coordX = e.offsetX; // setting actual X coord to calculate later
    coordY = e.offsetY; // setting actual Y coord to calculate later
    currEl = el; // setting the current element in the begining of drag start
    setTimeout(() => {
      el.style.display = "none"; // we do that because we want to hide node on a field after we start dragging
    }, 0);
  };
}
function onDragEnd(el) {
  return function () {
    el.style.display = "flex"; // setting back display from none
  };
}
function printScore() {
  // printing our scores to a DOM
  leftScore.innerHTML = leftScoreCount;
  rightScore.innerHTML = rightScoreCount;
}
