import express from "express";
import createHttpError, { HttpError } from "http-errors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./user/user.router.ts";
import bookRouter from "./book/book.router.ts";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  const error = createHttpError(400, "something went wrong");
  throw error;
});

app.use("/api/users", userRouter);
app.use("/api/books", userRouter);

// Global error handler (this should be  in the last of the app)
app.use(globalErrorHandler);

export default app;
