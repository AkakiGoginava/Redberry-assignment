export const TOKEN = "9e6c758a-eaa2-40d8-b50c-11644912ac6d";
export const server = "https://momentum.redberryinternship.ge/api";

export const state = {
  taskArray: [],
  departmentArray: [],
  employeeArray: [],
  priorityArray: [],
  statusArray: [],
};

// General Function to Fetch Data From Server
export const fetchData = async function (PATH) {
  const response = await fetch(`${server}/${PATH}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.json();
};

state.taskArray = await fetchData("tasks");
state.employeeArray = await fetchData("employees");
state.departmentArray = await fetchData("departments");
state.priorityArray = await fetchData("priorities");
state.statusArray = await fetchData("statuses");

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

// Requirement Label Reaction
export const validateLabel = function (condition, text, icon = null) {
  if (condition) {
    text.classList.remove("invalid-label");
    text.classList.add("valid-label");
    if (icon) icon.src = "./resources/SVG/CheckmarkGreen.svg";
  } else {
    text.classList.remove("valid-label");
    text.classList.add("invalid-label");
    if (icon) icon.src = "./resources/SVG/CheckmarkRed.svg";
  }
};

// Reset Labels
export const resetLabel = function (text, icon = null) {
  text.classList.remove("invalid-label");
  text.classList.remove("valid-label");
  if (icon) icon.src = "./resources/SVG/CheckmarkGray.svg";
};
