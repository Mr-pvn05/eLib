import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

// Routes
app.get("/", (req, res) => {
  const error = createHttpError(400, "something went wrong");
  throw error;
});

// Global error handler (this should be in the last of the app)
app.use(globalErrorHandler);

export default app;
