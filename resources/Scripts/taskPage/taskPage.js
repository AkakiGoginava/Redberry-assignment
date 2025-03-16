import { state, months, priorities } from "../global/global.js";
import * as createEmployee from "../global/createEmployee.js";
import { initializeDropdownMenu } from "../global/dropDownMenu.js";

// Create Dropdown Menu For Status Input
const statusDropdownMenu = initializeDropdownMenu("status-input");

statusDropdownMenu.renderOptions(state.statusArray);
