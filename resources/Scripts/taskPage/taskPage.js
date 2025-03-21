import {
  state,
  TOKEN,
  priorities,
  days,
  departmentColors,
  fetchData,
  server,
} from "../global/global.js";
import * as createEmployee from "../global/createEmployee.js";
import { initializeDropdownMenu } from "../global/dropDownMenu.js";

// Retrieve Opened Task Id
const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get("id");

const taskInput = document.querySelector(".status-input");

const countComments = function (comments) {
  let size = comments.length;
  comments.forEach((comment) => {
    size += comment.sub_comments.length;
  });

  return size;
};

async function fetchComments(taskId) {
  try {
    const response = await fetch(
      `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching task:", error);
  }
}

const task = await fetchData(`tasks/${taskId}`); // Fetch Task Data by Id
let comments = await fetchData(`tasks/${taskId}/comments`); // Fetch Comment Data by Task Id

// Create Dropdown Menu For Status Input
const statusDropdownMenu = initializeDropdownMenu("status-input");
statusDropdownMenu.renderOptions(state.statusArray);

// Validation For Comment Input
const validateCommentText = function (text, target) {
  const commentField = target.closest(".comment-input-block");

  if (text.trim()) {
    commentField.classList.remove("invalid-input");
    return true;
  } else {
    commentField.classList.add("invalid-input");
  }
};

const genrateCommentsMarkup = function (data) {
  let markup = ``;
  data.forEach((comment) => {
    // Create Markup For Parent Comment
    markup += ` <div class="comment" id="comment-${comment.id}">
                <div class="comment-body">
                  <img
                    src=${comment.author_avatar}
                    class="comment-avatar"
                  />

                  <div class="comment-text">
                    <p class="comment-author">${comment.author_nickname}</p>
                    <p class="comment-desc">
                      ${comment.text}
                    </p>
                    <button class="comment-reply-button" id="reply-btn-${comment.id}">
                      <img src="./resources/SVG/ReplyIcon.svg" />უპასუხე
                    </button>
                  </div>
                </div>
                <div class="comment-input-block hidden" id="reply-input-${comment.id}">
                  <textarea
                    class="comment-field"
                    placeholder="დაწერე კომენტარი"
                  ></textarea>

                  <button type="button" class="comment-button">
                    დააკომენტარე
                  </button>
                </div>`;
    // Attach Markup For Replies if There are Any
    if (comment.sub_comments.length !== 0) {
      markup += `<div class="comment-replies">`;
      comment.sub_comments.forEach((subComment) => {
        markup += `<div class="comment-reply" id = "comment-reply-${subComment.id}">
                  <div class="comment-body">
                    <img
                      src=${subComment.author_avatar}
                      class="comment-avatar"
                    />

                    <div class="comment-text">
                      <p class="comment-author">${subComment.author_nickname}</p>
                      <p class="comment-desc">
                        ${subComment.text}
                      </p>
                    </div>
                  </div>
                </div>`;
      });
      markup += `</div>`;
    }
    markup += `</div>`;
  });

  return markup;
};

const renderComments = function (comments) {
  // Clear Container Before Rendering
  document.querySelector(".comment-container").innerHTML = "";

  const markup = genrateCommentsMarkup(comments);
  document
    .querySelector(".comment-container")
    .insertAdjacentHTML("beforeend", markup);

  const replyBtn = document.querySelectorAll(".comment-reply-button");

  // Event Listener For Reply Input Field Display
  replyBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Display Input Field Based on Target Button Id
      const id = btn.closest(".comment").id.split("-")[1];
      const replyInputField = document.getElementById(`reply-input-${id}`);

      replyInputField.classList.toggle("hidden");
      replyInputField.classList.remove("invalid-input");
    });

    // Event Listeners For Reply Button Hover Effect
    btn.addEventListener("mouseenter", function () {
      this.style.setProperty("color", "#B588F4");
      this.querySelector("img").src = "./resources/SVG/ReplyIconFaded.svg";
    });
    btn.addEventListener("mouseleave", function () {
      this.style.setProperty("color", "#8338ec");
      this.querySelector("img").src = "./resources/SVG/ReplyIcon.svg";
    });
  });

  // Event Listener For Comment/Reply Submit Buttons
  document.querySelectorAll(".comment-button").forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      // Find Related Comment Field
      const commentInput = e.target
        .closest(".comment-input-block")
        .querySelector(".comment-field");

      const commentText = commentInput.value;

      if (!validateCommentText(commentText, e.target)) return;
      commentInput.value = ""; // Empty Comment Input Field on Submission

      let parentId = null;
      // If Parent Comment Exists Overwrite Default ParentId=null
      const parentComment = e.target.closest(".comment");
      if (parentComment) {
        parentId = parentComment.id.split("-")[1];
      }

      const commentData = {
        text: commentText,
        parent_id: parentId,
      };

      // Send Comment Data
      await fetch(`${server}/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      })
        .then(async function () {
          // Update and Re-render Comments
          comments = await fetchData(`tasks/${taskId}/comments`);

          renderComments(comments);
          document.querySelector(".comment-num").textContent =
            countComments(comments);
        })
        .then(async function () {
          // Update Tasks For Correct Comment Count
          state.taskArray = await fetchData("tasks");
        });
    });
  });
};

// Render Task Details
const renderPage = function (task) {
  document.querySelector("title").textContent = task.name;

  const priorityTag = document.querySelector(".task-tags-priority");
  const departmentTag = document.querySelector(".task-tags-department");

  priorityTag.querySelector("img").src = `${task.priority.icon}`;
  priorityTag.querySelector("span").textContent = `${task.priority.name}`;
  priorityTag.classList.add(
    `tags-priority-${priorities[task.priority.id - 1]}`
  );

  departmentTag.classList.add(`department-${task.department.id}`);
  departmentTag.textContent = task.department.name;
  departmentTag.style.setProperty(
    "background-color",
    departmentColors[task.department.id % 4]
  );

  document.querySelector(".task-body-title").textContent = task.name;

  document.querySelector(".task-body-desc").textContent = task.description;

  document.querySelector(".status-text").textContent = task.status.name;
  document.querySelector(".status-input").value = task.status.id;

  document.querySelector(
    ".details-employee-name"
  ).textContent = `${task.employee.name} ${task.employee.surname}`;
  document.querySelector(".details-employee-department").textContent =
    task.department.name;
  document.querySelector(".details-employee-avatar").src = task.employee.avatar;

  const day = days[new Date(task.due_date).getDay()];
  const date = task.due_date.split("-");
  const formattedDate = `${day} - ${date[2].slice(0, 2)}/${parseInt(
    date[1],
    10
  )}/${date[0]}`;
  document.querySelector(".details-date").textContent = formattedDate;

  document.querySelector(".comment-num").textContent = countComments(comments);
};

renderPage(task);
renderComments(comments);

// Event Listenr For Task Status Change
taskInput.addEventListener("valueChange", async function () {
  if (this.value === task.status.id) return;

  const newId = this.value;
  const data = { status_id: parseInt(newId) };

  // Update Task Status
  await fetch(`${server}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
    },
  }).then(async function (response) {
    if (response.status === 200) {
      // Update Tasks
      state.taskArray = fetchData("tasks");
    }
  });
});
