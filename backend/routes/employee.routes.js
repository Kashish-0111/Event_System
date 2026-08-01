import { Router } from "express";
import { 
  addEmployee, 
  getEmployees, 
  updateEmployee, 
  deleteEmployee 
} from "../controllers/employee.controller.js";

const router = Router();

router.get("/", getEmployees);
router.post("/", addEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;