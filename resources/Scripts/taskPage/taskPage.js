import { state, months, priorities } from "../global/global.js";
import * as createEmployee from "../global/createEmployee.js";
import { initializeDropdownMenu } from "../global/dropDownMenu.js";

const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get("id");

const task = {
  id: 1,
  name: "შესარჩევი დავალება",
  description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
  due_date: "2025-12-31",
  status: {
    id: 1,
    name: "Todo",
  },
  priority: {
    id: 1,
    name: "High",
    icon: "…",
  },
  department: {
    id: 1,
    name: "IT",
  },
  employee: {
    id: 1,
    name: "ლადო",
    surname: "გაგა",
    avatar: "…",
    department_id: 1,
  },
};

// const comments = [
//   {
//     id: 1,
//     text: "ეს დავალება საერთიდ არ არის რთული",
//     task_id: 1,
//     parent_id: null,
//     author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.1",
//     author_nickname: "Gela",
//     sub_comments: [
//       {
//         id: 2,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 1,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//       {
//         id: 3,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 1,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//       {
//         id: 4,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 1,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//       {
//         id: 5,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 1,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//     ],
//   },
//   {
//     id: 6,
//     text: "ეს დავალება საერთიდ არ არის რთული",
//     task_id: 1,
//     parent_id: null,
//     author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.1",
//     author_nickname: "Gela",
//     sub_comments: [
//       {
//         id: 7,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 6,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//       {
//         id: 7,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 6,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//       {
//         id: 7,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 6,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//       {
//         id: 7,
//         text: "ვისთვის როგორ",
//         task_id: 1,
//         parent_id: 6,
//         author_avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=127.0.0.2",
//         author_nickname: "Lela",
//       },
//     ],
//   },
// ];

// Create Dropdown Menu For Status Input
const statusDropdownMenu = initializeDropdownMenu("status-input");

statusDropdownMenu.renderOptions(state.statusArray);

const genrateCommentsMarkup = function (data) {
  let markup = ``;
  data.forEach((comment) => {
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

const renderComments = function () {
  const markup = genrateCommentsMarkup(comments);
  document
    .querySelector(".comment-container")
    .insertAdjacentHTML("beforeend", markup);

  const replybtn = document.querySelectorAll(".comment-reply-button");
  replybtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = btn.closest(".comment").id.split("-")[1];

      const replyInputField = document.getElementById(`reply-input-${id}`);

      replyInputField.classList.toggle("hidden");
    });
  });
};

const renderPage = function (task) {
  const priorityTag = document.querySelector(".task-tags-priority");
  const departmentTag = document.querySelector(".task-tags-department");

  priorityTag.querySelector(
    "img"
  ).src = `./resources/SVG/${task.priority.name}.svg`;
  priorityTag.classList.add(
    `tags-priority-${task.priority.name.toLowerCase()}`
  );

  departmentTag.classList.add(`department-${task.department.id}`);
  departmentTag.textContent = task.department.name;

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

  document.querySelector(".details-date").textContent = task.due_date;
};

renderPage(task);
