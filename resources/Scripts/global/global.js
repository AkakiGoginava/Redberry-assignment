export const TOKEN = "9e6c758a-eaa2-40d8-b50c-11644912ac6d";

export const state = {
  taskArray: [],
  departmentArray: [],
  employeeArray: [],
  priorityArray: [],
  statusArray: [],
  filter: {
    departments: [],
    priorities: [],
    employees: [],
  },
};

await fetch("https://momentum.redberryinternship.ge/api/tasks", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    state.taskArray = data;
  });

await fetch("https://momentum.redberryinternship.ge/api/employees", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    state.employeeArray = data;
  });

await fetch("https://momentum.redberryinternship.ge/api/departments", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    state.departmentArray = data;
  });

await fetch("https://momentum.redberryinternship.ge/api/priorities", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    state.priorityArray = data;
  });

await fetch("https://momentum.redberryinternship.ge/api/statuses", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    state.statusArray = data;
  });

export const months = [
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

export const priorities = ["low", "medium", "high"];
export const departmentColors = ["#FF66A8", "#FD9A6A", "#89B6FF", "#FFD86D"];

// state.taskArray = [
//   {
//     id: 1,
//     name: "შესარჩევი დავალება",
//     description:
//       "შექმენით ვებ გვერდი დიზაინის მიხედვით aaasddasdasd asdasdasdasdska gjhsdlkgjhadf lkgjhadfl kjgh asd asd asd asfas sd fsd fsd f",
//     due_date: "2025-12-31",
//     status: {
//       id: 1,
//       name: "Todo",
//     },
//     priority: {
//       id: 1,
//       name: "High",
//       icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
//     },
//     department: {
//       id: 1,
//       name: "design",
//     },
//     employee: {
//       id: 1,
//       name: "ლადო",
//       surname: "გაგა",
//       avatar: "resources/placeholder.webp",
//       department_id: 1,
//     },
//     total_comments: 0,
//   },
//   {
//     id: 2,
//     name: "შესარჩევი დავალება",
//     description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
//     due_date: "2025-08-31",
//     status: {
//       id: 3,
//       name: "Todo",
//     },
//     priority: {
//       id: 3,
//       name: "Low",
//       icon: "https://momentum.redberryinternship.ge/storage/priority-icons/Low.svg",
//     },
//     department: {
//       id: 2,
//       name: "2",
//     },
//     employee: {
//       id: 1,
//       name: "ლადო",
//       surname: "გაგა",
//       avatar: "resources/placeholder.webp",
//       department_id: 1,
//     },
//     total_comments: 4,
//   },
//   {
//     id: 3,
//     name: "შესარჩევი დავალება",
//     description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
//     due_date: "2025-04-31",
//     status: {
//       id: 4,
//       name: "Todo",
//     },
//     priority: {
//       id: 1,
//       name: "High",
//       icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
//     },
//     department: {
//       id: 4,
//       name: "4",
//     },
//     employee: {
//       id: 1,
//       name: "ლადო",
//       surname: "გაგა",
//       avatar: "resources/placeholder.webp",
//       department_id: 1,
//     },
//     total_comments: 2,
//   },
//   {
//     id: 4,
//     name: "შესარჩევი დავალება",
//     description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
//     due_date: "2025-02-31",
//     status: {
//       id: 4,
//       name: "Todo",
//     },
//     priority: {
//       id: 2,
//       name: "Medium",
//       icon: "https://momentum.redberryinternship.ge/storage/priority-icons/Medium.svg",
//     },
//     department: {
//       id: 1,
//       name: "design",
//     },
//     employee: {
//       id: 1,
//       name: "ლადო",
//       surname: "გაგა",
//       avatar: "resources/placeholder.webp",
//       department_id: 1,
//     },
//     total_comments: 10,
//   },
//   {
//     id: 5,
//     name: "შესარჩევი დავალება",
//     description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
//     due_date: "2025-01-31",
//     status: {
//       id: 2,
//       name: "Todo",
//     },
//     priority: {
//       id: 1,
//       name: "High",
//       icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
//     },
//     department: {
//       id: 1,
//       name: "1",
//     },
//     employee: {
//       id: 1,
//       name: "ლადო",
//       surname: "გაგა",
//       avatar: "resources/placeholder.webp",
//       department_id: 1,
//     },
//     total_comments: 20,
//   },
//   {
//     id: 1,
//     name: "შესარჩევი დავალება",
//     description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
//     due_date: "2025-12-31",
//     status: {
//       id: 2,
//       name: "Todo",
//     },
//     priority: {
//       id: 1,
//       name: "High",
//       icon: "https://momentum.redberryinternship.ge/storage/priority-icons/High.svg",
//     },
//     department: {
//       id: 1,
//       name: "design",
//     },
//     employee: {
//       id: 1,
//       name: "ლადო",
//       surname: "გაგა",
//       avatar: "resources/placeholder.webp",
//       department_id: 1,
//     },
//     total_comments: 13,
//   },
//   {
//     id: 1,
//     name: "შესარჩევი დავალება",
//     description: "შექმენით ვებ გვერდი დიზაინის მიხედვით",
//     due_date: "2025-12-31",
//     status: {
//       id: 2,
//       name: "Todo",
//     },
//     priority: {
//       id: 2,
//       name: "Medium",
//       icon: "https://momentum.redberryinternship.ge/storage/priority-icons/Medium.svg",
//     },
//     department: {
//       id: 1,
//       name: "design",
//     },
//     employee: {
//       id: 1,
//       name: "ლადო",
//       surname: "გაგა",
//       avatar: "resources/placeholder.webp",
//       department_id: 1,
//     },
//     total_comments: 8,
//   },
// ];
