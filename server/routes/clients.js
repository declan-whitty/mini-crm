import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json([{ name: "Example Client", email: "client@email.com" }]);
});

export default router;
