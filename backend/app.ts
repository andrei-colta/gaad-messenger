import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index";

dotenv.config();

const app = express();

class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Add routes
app.use("/", routes);

// Handle 404 errors
app.use((req, res, next) => {
  const error = new HttpError("Resource not found", 404);
  next(error);
});

// Handle errors
app.use((error: HttpError, req: any, res: any, next: any) => {
  res.status(error.statusCode || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
