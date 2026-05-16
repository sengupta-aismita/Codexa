import multer from "multer";
import { ApiError } from "../utils/api-error.js";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new ApiError(400, "Only PDF files allowed"));
    }

    cb(null, true);
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});