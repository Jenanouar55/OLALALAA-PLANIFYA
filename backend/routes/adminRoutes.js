const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// All routes here require auth + admin
router.use(authMiddleware);
// router.use(adminMiddleware);

router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.delete("/users/:id", adminController.deleteUser);
// router.put('/users/:id/role', adminController.updateUserRole); Not for now maybe never

// Event management
router.get("/events", eventController.getAllEvents);
router.get("/events/:id", eventController.getEventById);
router.post("/events", eventController.createEvent);
router.put("/events/:id", eventController.updateEvent);
router.delete("/events/:id", eventController.deleteEvent);
router.post("/events/seed", eventController.seedFromCalendarific); // Calendarific seed

module.exports = router;
