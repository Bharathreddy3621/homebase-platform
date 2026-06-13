import multer from "multer";

const randomString = (length) => { 
  const characters = 'abcdefghijklmnopqrstuvwxyz';
   let result = ''; 
   for (let i = 0; i < length; i++) { 
    result += characters.charAt(Math.floor(Math.random() * characters.length)); 
  } 
  return result; 
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photoUrl") {
      cb(null, "uploads/");
    } else if (file.fieldname === "houseRules") {
      cb(null, "houseRules/");
    }
  },

  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photoUrl") {
    const allowed = [
      "image/png",
      "image/jpg",
      "image/jpeg"
    ];

    cb(null, allowed.includes(file.mimetype));
  }

  else if (file.fieldname === "houseRules") {
    cb(null, file.mimetype === "application/pdf");
  }

  else {
    cb(null, false);
  }
};

export default multer({
  storage,
  fileFilter
});