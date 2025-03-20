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

export const days = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"];

export const priorities = ["low", "medium", "high"];
export const departmentColors = ["#FF66A8", "#FD9A6A", "#89B6FF", "#FFD86D"];
