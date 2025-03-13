const TOKEN = "9e6c758a-eaa2-40d8-b50c-11644912ac6d";

let taskArray = [
  {
    id: 1,
    name: "შესარჩევი დავალება",
    description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
    due_date: "2025-12-31",
    status: {
      id: 2,
      name: "Todo",
    },
    priority: {
      id: 1,
      name: "High",
      icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
    },
    department: {
      id: 1,
      name: "design",
    },
    employee: {
      id: 1,
      name: "ლადო",
      surname: "გაგა",
      avatar: "resources/placeholder.webp",
      department_id: 1,
    },
  },
  {
    id: 2,
    name: "შესარჩევი დავალება",
    description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
    due_date: "2025-08-31",
    status: {
      id: 3,
      name: "Todo",
    },
    priority: {
      id: 3,
      name: "Low",
      icon: "https://momentum.redberryinternship.ge/storage/priority-icons/Low.svg",
    },
    department: {
      id: 2,
      name: "2",
    },
    employee: {
      id: 1,
      name: "ლადო",
      surname: "გაგა",
      avatar: "resources/placeholder.webp",
      department_id: 1,
    },
  },
  {
    id: 3,
    name: "შესარჩევი დავალება",
    description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
    due_date: "2025-04-31",
    status: {
      id: 4,
      name: "Todo",
    },
    priority: {
      id: 1,
      name: "High",
      icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
    },
    department: {
      id: 4,
      name: "4",
    },
    employee: {
      id: 1,
      name: "ლადო",
      surname: "გაგა",
      avatar: "resources/placeholder.webp",
      department_id: 1,
    },
  },
  {
    id: 4,
    name: "შესარჩევი დავალება",
    description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
    due_date: "2025-02-31",
    status: {
      id: 4,
      name: "Todo",
    },
    priority: {
      id: 2,
      name: "Medium",
      icon: "https://momentum.redberryinternship.ge/storage/priority-icons/Medium.svg",
    },
    department: {
      id: 1,
      name: "design",
    },
    employee: {
      id: 1,
      name: "ლადო",
      surname: "გაგა",
      avatar: "resources/placeholder.webp",
      department_id: 1,
    },
  },
  {
    id: 5,
    name: "შესარჩევი დავალება",
    description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
    due_date: "2025-01-31",
    status: {
      id: 2,
      name: "Todo",
    },
    priority: {
      id: 1,
      name: "Low",
      icon: "https://momentum.redberryinternship.ge/storage/priority-icons/Low.svg",
    },
    department: {
      id: 1,
      name: "1",
    },
    employee: {
      id: 1,
      name: "ლადო",
      surname: "გაგა",
      avatar: "resources/placeholder.webp",
      department_id: 1,
    },
  },
  {
    id: 1,
    name: "შესარჩევი დავალება",
    description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
    due_date: "2025-12-31",
    status: {
      id: 2,
      name: "Todo",
    },
    priority: {
      id: 1,
      name: "High",
      icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
    },
    department: {
      id: 1,
      name: "design",
    },
    employee: {
      id: 1,
      name: "ლადო",
      surname: "გაგა",
      avatar: "resources/placeholder.webp",
      department_id: 1,
    },
  },
  {
    id: 1,
    name: "შესარჩევი დავალება",
    description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
    due_date: "2025-12-31",
    status: {
      id: 2,
      name: "Todo",
    },
    priority: {
      id: 1,
      name: "High",
      icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
    },
    department: {
      id: 1,
      name: "design",
    },
    employee: {
      id: 1,
      name: "ლადო",
      surname: "გაგა",
      avatar: "resources/placeholder.webp",
      department_id: 1,
    },
  },
];

taskArray.forEach((task) => {
  let locationClassName;
  switch (task.status.id) {
    case 1:
      locationClassName = ".list-pending";
      break;
    case 2:
      locationClassName = ".list-inprogress";
      break;
    case 3:
      locationClassName = ".list-testing";
      break;
    case 4:
      locationClassName = ".list-finished";
      break;
  }

  let priorityName;
  switch (task.priority.id) {
    case 1:
      priorityName = "მაღალი";
      break;
    case 2:
      priorityName = "საშუალო";
      break;
    case 3:
      priorityName = "დაბალი";
      break;
  }

  const due_date = task.due_date.split("-");
  const months = [
    "იანვ",
    "თებ",
    "მარ",
    "აპრ",
    "მაი",
    "ივნ",
    "ივლ",
    "აგვ",
    "სექ",
    "ოქტ",
    "ნოე",
    "დეკ",
  ];

  const taskCardHTML = `
    <div class="task-card">
      <div class="task-card-header">
          <div class="task-card-tags">
            <div class="priority priority-${task.priority.name.toLowerCase()}">
              <img src="${task.priority.icon}" />
              <p class="priority-${task.priority.name.toLowerCase()}">${priorityName}</p>
            </div>
            <p class="department department-${task.department.id}">${
    task.department.name
  }</p>
          </div>
          <p class="task-date">${due_date[2]} ${months[due_date[1] - 1]}, ${
    due_date[0]
  }</p>
        </div>

        <div class="task-body">
          <h6 class="task-name">${task.name}</h6>
          <p class="task-desc">
            ${task.description}
          </p>
        </div>

        <div class="task-footer">
          <img
            class="task-mini-avatar"
            src="${task.employee.avatar}"
          />
          <div class="task-comment-count">
            <img src="resources/SVG/Comment.svg" />
            <span>8</span>
          </div>
        </div>
    </div>`;

  document
    .querySelector(locationClassName)
    ?.querySelector(".task-list")
    ?.insertAdjacentHTML("beforeend", taskCardHTML);
});
