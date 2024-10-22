// const express = require('express')
// const connectDb = require("./db/config")
// const cors = require('cors');
// const fs = require('fs');
// const mongoose = require('mongoose');


// const dotenv = require('dotenv');
// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const dev_mode = process.env.DEV_MODE;

// const User = require('./model/user');
// const College = require('./model/college');
// const Marksheet = require('./model/marksheet');
// const Student = require('./model/student');
// const Role = require('./model/role');
// const multer = require('multer');
// const path = require('path');

// // Set up storage engine for multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage });

// // app.use(cors(express.json()));
// const app = express()
// // app.use(express.json())
// app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ------------Users collectiion route------------------------
// app.post("/login", async (req, resp) => {
//     if (req.body.loginId && req.body.password) {
//         try {
//             //   //  this logic for case insensetive // //

//             // const caseInsensitiveIdEmamil = new RegExp(req.body.loginId, "i");
//             // const data = await User.findOne({loginId:caseInsensitiveIdEmamil, password :req.body.password}).select("-password");

//             const data = await User.findOne(req.body).select("-password")
//             if (data === null) {
//                 resp.send({ message: "No result found" })
//             } else {
//                 // console.log(data)
//                 resp.send(data)
//             }
//         } catch (err) {
//             console.log("Error in login Api", err)
//         }
//     } else if (req.body.loginId === "undefined") {
//         resp.send({ message: "Enter Email id" })
//     } else if (req.body.password === "undefined") {
//         resp.send({ message: "Enter Password" })
//     } else {
//         resp.send({ message: "Enter LoginId And Password" })
//     }
// })
// // ---------------------- user list-------------------------
// app.get("/user", async (req, resp) => {
//     try {
//         let data = await User.find();
//         resp.send(data)
//     } catch (err) {
//         console.log("Error on server", err.message)
//     }
// })
// // --------------------Create user----------------------------------
// // app.post("/user", upload.fields([{ name: 'image' }, { name: 'audio' }, { name: 'video' }]), async (req, resp) => {
// //     try {
// //         console.log('req.files:', req.files); // Inspect this to ensure it contains the expected fields

// //         let data = new User({
// //             firstName: req.body.firstName,
// //             lastName: req.body.lastName,
// //             loginId: req.body.loginId,
// //             password: req.body.password,
// //             dob: req.body.dob,
// //             roleId: req.body.roleId,
// //             image: req.files['image'] ? req.files['image'][0].path : null,
// //             // audio: req.files['audio'] ? req.files['audio'][0].path : null,
// //             // video: req.files['video'] ? req.files['video'][0].path : null,
// //         });
// //         let result = await data.save();
// //         resp.send(result);
// //         // res.status(201).json(result);

// //     } catch (err) {
// //         if (err?.errors?.roleId?.message) {
// //             resp.send(err?.errors?.roleId?.message)
// //         // res.status(400).json({ message: error.message });

// //         } else {
// //             console.log("Error in :",err)
// //             resp.send({ message: "Email id already exist" })
// //         }
// //         // console.log("Register user :-", err)
// //     }
// // })

// app.post('/user', upload.fields([{ name: 'image' }, { name: 'audio' }, { name: 'video' }]), async (req, resp) => {
//     let session;
//     try {
//         // Start a MongoDB session
//         session = await mongoose.startSession();
//         session.startTransaction();

//         // Save user data first
//         const user = new User({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             loginId: req.body.loginId,
//             password: req.body.password,
//             dob: req.body.dob,
//             roleId: req.body.roleId,
//         });

//         const savedUser = await user.save({ session });

//         // If saving the user was successful, handle file uploads
//         let imagePath = null;
//         if (req.files['image']) {
//             imagePath = req.files['image'][0].path;
//         }

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         // If user data is saved successfully, update user with file paths
//         if (imagePath) {
//             savedUser.image = imagePath;
//             await savedUser.save();
//         }

//         resp.status(201).send(savedUser);

//     } catch (err) {
//         if (session) {
//             // Abort the transaction if something goes wrong
//             await session.abortTransaction();
//             session.endSession();
//         }

//         // Clean up uploaded files if an error occurred
//         if (req.files['image']) {
//             fs.unlinkSync(req.files['image'][0].path); // Remove the file
//         }

//         console.error("Error in:", err);

//         // Handle validation errors and other errors
//         if (err?.errors?.roleId?.message) {
//             resp.status(400).send(err.errors.roleId.message);
//         } else {
//             resp.status(500).send({ message: "Internal server error" });
//         }
//     }
// });

// // --------------------Delete user----------------------------------
// app.delete("/user/:id", async (req, resp) => {
//     try {
//         // console.log("req in user", req.params)
//         let data = await User.deleteOne({ _id: req.params.id });
//         resp.send(data);
//     } catch (err) {
//         console.log("Error in delete user", err)
//     }
// })
// // --------------------Update user----------------------------------
// app.put("/user/:id", async (req, resp) => {
//     try {
//         // console.log("update id",req.params)
//         let data = await User.updateOne({ _id: req.params.id }, { $set: req.body })
//         resp.send(data)
//     } catch (err) {
//         console.log("Error in user update", err)
//         resp.send({ message: "user id exist" })
//     }
// })
// app.get("/user/:id", async (req, resp) => {
//     try {
//         let data = await User.findOne({ _id: req.params.id });
//         resp.send(data)
//     } catch (err) {
//         resp.send({ message: "Send correct id" })
//     }

// })
// // --------------------Search user----------------------------------
// app.get("/user/search/:key", async (req, resp) => {
//     const caseInsensitiveKey = new RegExp(req.params.key, "i");
//     let data = await User.find({
//         $or: [
//             { firstName: { $regex: caseInsensitiveKey } },
//             { lastName: { $regex: caseInsensitiveKey } },
//             { loginId: { $regex: caseInsensitiveKey } }
//         ]
//     })
//     resp.send(data)
// })
// // ------------Users collectiion End route------------------------
// // ------------College collectiion Start route------------------------
// app.post('/college', async (req, resp) => {
//     try {
//         let data = new College(req.body);
//         data = await data.save();
//         resp.send(data)
//     } catch (error) {
//         // console.log("College Catch block erroe", error.errors.mobileNo.message)
//         if (error?.errors?.mobileNo?.message) {
//             resp.send({ message: error.errors.mobileNo.message })
//         } else {
//             // resp.send(error.message)
//             resp.send({ message: "College already exist" })
//         }
//     }
// })
// app.put("/college/:id", async (req, resp) => {
//     console.log("College put api")
//     try {
//         let data = await College.updateOne({ _id: req.params.id }, { $set: req.body })
//         resp.send(data)
//     } catch (error) {
//         console.log("College put api catch block")
//         resp.send({ message: 'College already exiest' })
//     }
// })

// app.delete("/college/:id", async (req, resp) => {
//     try {
//         let data = await College.deleteOne({ _id: req.params.id })
//         resp.send(data)
//     } catch (error) {
//         resp.send({ message: "Id is not there / already deleted" });
//     }
// })
// app.get("/college", async (req, resp) => {
//     try {
//         let data = await College.find();
//         resp.send(data)
//     } catch (error) {
//         console.log(error)
//         resp.send({ message: "Look the console" })
//     }
// })
// app.get("/college/:id", async (req, resp) => {
//     try {
//         let data = await College.findOne({ _id: req.params.id })
//         resp.send(data)
//     } catch (error) {
//         console.log("college serach one")
//         resp.send({ message: "Put the correct id" })
//     }
// })
// app.get("/college/search/:key", async (req, resp) => {
//     const caseInsensitiveKey = new RegExp(req.params.key, "i");
//     let data = await College.find({
//         $or: [
//             { collegeName: { $regex: caseInsensitiveKey } },
//             { address: { $regex: caseInsensitiveKey } },
//             { city: { $regex: caseInsensitiveKey } },
//             { state: { $regex: caseInsensitiveKey } }
//         ]
//     })
//     resp.send(data)
// })
// // ------------College collectiion Start route------------------------
// // ------------Marksheet collectiion Start route------------------------
// app.post("/marksheet", async (req, resp) => {
//     try {
//         let data = new Marksheet(req.body);
//         data = await data.save();
//         resp.send(data);
//     } catch (error) {
//         console.log(error)
//         resp.send({ message: "StudentId / roll number alredy exist" })
//     }
// })
// app.get("/marksheet", async (req, resp) => {
//     let data = await Marksheet.find();
//     resp.send(data);
// })
// app.get("/marksheet/:id", async (req, resp) => {
//     try {
//         let data = await Marksheet.findOne({ _id: req.params.id });
//         resp.send(data);
//     } catch (error) {
//         console.log(error)
//         resp.send({ message: "Something is missing here in id" });
//     }
// })
// app.get("/marksheet/search/:key", async (req, resp) => {
//     try {
//         const caseInsensitiveKey = new RegExp(req.params.key);
//         let data = await Marksheet.find({
//             $or: [
//                 { name: { $regex: caseInsensitiveKey } },
//                 { studentId: { $regex: caseInsensitiveKey } },
//                 { rollNo: { $regex: caseInsensitiveKey } }
//             ]
//         });
//         resp.send(data);
//     } catch (error) {
//         console.log(error)
//     }

// })
// app.delete("/marksheet/:id", async (req, resp) => {
//     try {
//         let data = await Marksheet.deleteOne({ _id: req.params.id });
//         if (data.deletedCount == 0) {
//             resp.send({ message: "Data already deleted" })
//         } else {
//             resp.send(data)
//         }

//     } catch (error) {
//         console.log(error);
//         resp.send({ message: "Something is mssing here/ id issue." })

//     }
// })
// app.put("/marksheet/:id", async (req, resp) => {
//     try {
//         let data = await Marksheet.updateOne({ _id: req.params.id }, { $set: req.body })
//         resp.send(data)
//     } catch (error) {
//         console.log(error)
//     }
// })
// // ------------Marksheet collectiion End route------------------------
// // ------------Students collectiion Start route------------------------
// app.post("/student", async (req, resp) => {
//     try {
//         let data = new Student(req.body);
//         data = await data.save()
//         resp.send(data)
//     } catch (error) {
//         if (error?.keyPattern?.emailId === 1) {
//             resp.send({ message: "Email id already exist" })
//         } else if (error?.keyPattern?.collegeId === 1) {
//             resp.send({ message: "collegeId already exist" })
//         } else if (error?.errors?.mobileNo) {
//             resp.send(error?.errors?.mobileNo?.message)
//         } else {
//             console.log(error)
//             resp.send(error)
//         }
//     }
// })
// app.get("/student", async (req, resp) => {
//     let data = await Student.find()
//     try {
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// app.get("/student/:id", async (req, resp) => {
//     try {
//         let data = await Student.findOne({ _id: req.params.id });
//         resp.send(data)
//     } catch (error) {
//         if (error?.path === "_id") {
//             resp.send({ message: "Wrong id" })
//         } else {
//             resp.send(error)
//         }
//     }
// })
// app.get("/student/search/:key", async (req, resp) => {
//     try {
//         const caseInsensitiveKey = new RegExp(req.params.key)
//         let data = await Student.find({
//             $or: [
//                 { firstName: { $regex: caseInsensitiveKey } },
//                 { lastName: { $regex: caseInsensitiveKey } },
//                 { emailId: { $regex: caseInsensitiveKey } },
//                 { collegeId: { $regex: caseInsensitiveKey } },
//             ]
//         })
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// app.put("/student/:id", async (req, resp) => {
//     try {
//         let data = await Student.updateOne({ _id: req.params.id }, { $set: req.body });
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// app.delete("/student/:id", async (req, resp) => {
//     try {
//         let data = await Student.deleteOne({ _id: req.params.id });
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// // ------------Student collectiion End route------------------------
// // ------------Role collectiion start route------------------------
// app.post('/role', async (req, resp) => {
//     try {
//         let data = new Role(req.body);
//         data = await data.save();
//         resp.send(data)
//     } catch (error) {
//         if (error.keyPattern.name === 1) {
//             resp.send({ message: "Role already exist" })
//         } else {
//             resp.send(error)
//         }
//     }
// })
// app.get('/role', async (req, resp) => {
//     try {
//         let data = await Role.find()
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// app.get('/role/:id', async (req, resp) => {
//     try {
//         let data = await Role.findOne({ _id: req.params.id });
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// });
// app.get('/role/search/:key', async (req, resp) => {
//     const caseInsensitiveKey = new RegExp(req.params.key)
//     try {
//         let data = await Role.find({
//             $or: [
//                 { name: { $regex: caseInsensitiveKey } },
//                 { discription: { $regex: caseInsensitiveKey } }
//             ]
//         });
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// app.delete('/role/:id', async (req, resp) => {
//     try {
//         let data = await Role.find({ _id: req.params.id })
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// app.put('/role/:id', async (req, resp) => {
//     try {
//         let data = await Role.updateOne({ _id: req.params.id }, { $set: req.body })
//         resp.send(data)
//     } catch (error) {
//         resp.send(error)
//     }
// })
// // ------------Role collectiion End route------------------------





// // Middleware
// // app.use(express.json());
// // app.use('/api', itemsRouter);

// // Serve static files from the "uploads" directory
// app.use('/uploads', express.static('uploads'));


// // app.listen(PORT, () => {
// //     console.log(` Server run ${dev_mode} with port http://localhost:${PORT}`)
// // })


// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// // const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });








const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set up environment variables
const PORT = process.env.PORT || 5000;

// Set up models
const User = require('./model/user');
const College = require('./model/college');
const Marksheet = require('./model/marksheet');
const Student = require('./model/student');
const Role = require('./model/role');

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log('MongoDB connection error:', err));

// ------------Users Collection Route------------------------
app.post("/login", async (req, resp) => {
    if (req.body.loginId && req.body.password) {
        try {
            const data = await User.findOne(req.body).select("-password");
            if (data === null) {
                resp.send({ message: "No result found" });
            } else {
                resp.send(data);
            }
        } catch (err) {
            console.log("Error in login Api", err);
            resp.status(500).send({ message: "Internal server error" });
        }
    } else {
        resp.send({ message: "Enter LoginId And Password" });
    }
});

// ---------------------- User List-------------------------
app.get("/user", async (req, resp) => {
    try {
        let data = await User.find();
        resp.send(data);
    } catch (err) {
        console.log("Error on server", err.message);
        resp.status(500).send({ message: "Internal server error" });
    }
});

// --------------------Create User----------------------------------
app.post('/user', upload.fields([{ name: 'image' }, { name: 'audio' }, { name: 'video' }]), async (req, resp) => {
    try {
        // Save user data first
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            loginId: req.body.loginId,
            password: req.body.password,
            dob: req.body.dob,
            roleId: req.body.roleId,
        });

        const savedUser = await user.save();

        // Handle file uploads
        let imagePath = null;
        if (req.files['image']) {
            imagePath = req.files['image'][0].path;
        }

        // If user data is saved successfully, update user with file paths
        if (imagePath) {
            savedUser.image = imagePath;
            await savedUser.save();
        }

        resp.status(201).send(savedUser);

    } catch (err) {
        // Clean up uploaded files if an error occurred
        if (req.files['image']) {
            fs.unlinkSync(req.files['image'][0].path); // Remove the file
        }

        console.error("Error in:", err);
        resp.status(500).send({ message: "Internal server error" });
    }
});

// --------------------Delete User----------------------------------
app.delete("/user/:id", async (req, resp) => {
    try {
        let data = await User.deleteOne({ _id: req.params.id });
        resp.send(data);
    } catch (err) {
        console.log("Error in delete user", err);
        resp.status(500).send({ message: "Internal server error" });
    }
});

// --------------------Update User----------------------------------
app.put("/user/:id", async (req, resp) => {
    try {
        let data = await User.updateOne({ _id: req.params.id }, { $set: req.body });
        resp.send(data);
    } catch (err) {
        console.log("Error in user update", err);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/user/:id", async (req, resp) => {
    try {
        let data = await User.findOne({ _id: req.params.id });
        resp.send(data);
    } catch (err) {
        resp.status(500).send({ message: "Internal server error" });
    }
});

// --------------------Search User----------------------------------
app.get("/user/search/:key", async (req, resp) => {
    const caseInsensitiveKey = new RegExp(req.params.key, "i");
    try {
        let data = await User.find({
            $or: [
                { firstName: { $regex: caseInsensitiveKey } },
                { lastName: { $regex: caseInsensitiveKey } },
                { loginId: { $regex: caseInsensitiveKey } }
            ]
        });
        resp.send(data);
    } catch (err) {
        resp.status(500).send({ message: "Internal server error" });
    }
});

// ------------Users Collection End Route------------------------
// ------------College Collection Start Route------------------------

app.post('/college', async (req, resp) => {
    try {
        let data = new College(req.body);
        data = await data.save();
        resp.send(data);
    } catch (error) {
        if (error?.errors?.mobileNo?.message) {
            resp.send({ message: error.errors.mobileNo.message });
        } else {
            resp.send({ message: "College already exists" });
        }
    }
});

app.put("/college/:id", async (req, resp) => {
    try {
        let data = await College.updateOne({ _id: req.params.id }, { $set: req.body });
        resp.send(data);
    } catch (error) {
        console.log("College update error", error);
        resp.status(500).send({ message: 'Internal server error' });
    }
});

app.delete("/college/:id", async (req, resp) => {
    try {
        let data = await College.deleteOne({ _id: req.params.id });
        resp.send(data);
    } catch (error) {
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/college", async (req, resp) => {
    try {
        let data = await College.find();
        resp.send(data);
    } catch (error) {
        console.log("Error fetching colleges", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/college/:id", async (req, resp) => {
    try {
        let data = await College.findOne({ _id: req.params.id });
        resp.send(data);
    } catch (error) {
        console.log("Error fetching college", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/college/search/:key", async (req, resp) => {
    const caseInsensitiveKey = new RegExp(req.params.key, "i");
    try {
        let data = await College.find({
            $or: [
                { collegeName: { $regex: caseInsensitiveKey } },
                { address: { $regex: caseInsensitiveKey } },
                { city: { $regex: caseInsensitiveKey } },
                { state: { $regex: caseInsensitiveKey } }
            ]
        });
        resp.send(data);
    } catch (error) {
        console.log("Error searching colleges", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

// ------------College Collection End Route------------------------
// ------------Marksheet Collection Start Route------------------------

app.post("/marksheet", async (req, resp) => {
    try {
        let data = new Marksheet(req.body);
        data = await data.save();
        resp.send(data);
    } catch (error) {
        console.log("Error saving marksheet", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/marksheet", async (req, resp) => {
    try {
        let data = await Marksheet.find();
        resp.send(data);
    } catch (error) {
        console.log("Error fetching marksheets", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/marksheet/:id", async (req, resp) => {
    try {
        let data = await Marksheet.findOne({ _id: req.params.id });
        resp.send(data);
    } catch (error) {
        console.log("Error fetching marksheet", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/marksheet/search/:key", async (req, resp) => {
    try {
        const caseInsensitiveKey = new RegExp(req.params.key, "i");
        let data = await Marksheet.find({
            $or: [
                { name: { $regex: caseInsensitiveKey } },
                { studentId: { $regex: caseInsensitiveKey } },
                { rollNo: { $regex: caseInsensitiveKey } }
            ]
        });
        resp.send(data);
    } catch (error) {
        console.log("Error searching marksheets", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.delete("/marksheet/:id", async (req, resp) => {
    try {
        let data = await Marksheet.deleteOne({ _id: req.params.id });
        if (data.deletedCount == 0) {
            resp.send({ message: "Data already deleted" });
        } else {
            resp.send(data);
        }
    } catch (error) {
        console.log("Error deleting marksheet", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.put("/marksheet/:id", async (req, resp) => {
    try {
        let data = await Marksheet.updateOne({ _id: req.params.id }, { $set: req.body });
        resp.send(data);
    } catch (error) {
        console.log("Error updating marksheet", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

// ------------Marksheet Collection End Route------------------------
// ------------Students Collection Start Route------------------------

app.post("/student", async (req, resp) => {
    try {
        let data = new Student(req.body);
        data = await data.save();
        resp.send(data);
    } catch (error) {
        if (error?.keyPattern?.emailId === 1) {
            resp.send({ message: "Email id already exists" });
        } else if (error?.keyPattern?.collegeId === 1) {
            resp.send({ message: "collegeId already exists" });
        } else if (error?.errors?.mobileNo) {
            resp.send(error?.errors?.mobileNo?.message);
        } else {
            console.log("Error saving student", error);
            resp.status(500).send({ message: "Internal server error" });
        }
    }
});

app.get("/student", async (req, resp) => {
    try {
        let data = await Student.find();
        resp.send(data);
    } catch (error) {
        console.log("Error fetching students", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/student/:id", async (req, resp) => {
    try {
        let data = await Student.findOne({ _id: req.params.id });
        resp.send(data);
    } catch (error) {
        if (error?.path === "_id") {
            resp.send({ message: "Wrong id" });
        } else {
            console.log("Error fetching student", error);
            resp.status(500).send({ message: "Internal server error" });
        }
    }
});

app.get("/student/search/:key", async (req, resp) => {
    try {
        const caseInsensitiveKey = new RegExp(req.params.key, "i");
        let data = await Student.find({
            $or: [
                { firstName: { $regex: caseInsensitiveKey } },
                { lastName: { $regex: caseInsensitiveKey } },
                { emailId: { $regex: caseInsensitiveKey } },
                { collegeId: { $regex: caseInsensitiveKey } },
            ]
        });
        resp.send(data);
    } catch (error) {
        console.log("Error searching students", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.put("/student/:id", async (req, resp) => {
    try {
        let data = await Student.updateOne({ _id: req.params.id }, { $set: req.body });
        resp.send(data);
    } catch (error) {
        console.log("Error updating student", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.delete("/student/:id", async (req, resp) => {
    try {
        let data = await Student.deleteOne({ _id: req.params.id });
        resp.send(data);
    } catch (error) {
        console.log("Error deleting student", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

// ------------Student Collection End Route------------------------
// ------------Role Collection Start Route------------------------

app.post('/role', async (req, resp) => {
    try {
        let data = new Role(req.body);
        data = await data.save();
        resp.send(data);
    } catch (error) {
        if (error.keyPattern.name === 1) {
            resp.send({ message: "Role already exists" });
        } else {
            console.log("Error saving role", error);
            resp.status(500).send({ message: "Internal server error" });
        }
    }
});

app.get('/role', async (req, resp) => {
    try {
        let data = await Role.find();
        resp.send(data);
    } catch (error) {
        console.log("Error fetching roles", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get('/role/:id', async (req, resp) => {
    try {
        let data = await Role.findOne({ _id: req.params.id });
        resp.send(data);
    } catch (error) {
        console.log("Error fetching role", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get('/role/search/:key', async (req, resp) => {
    const caseInsensitiveKey = new RegExp(req.params.key, "i");
    try {
        let data = await Role.find({
            $or: [
                { name: { $regex: caseInsensitiveKey } },
                { description: { $regex: caseInsensitiveKey } }
            ]
        });
        resp.send(data);
    } catch (error) {
        console.log("Error searching roles", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.delete('/role/:id', async (req, resp) => {
    try {
        let data = await Role.deleteOne({ _id: req.params.id });
        resp.send(data);
    } catch (error) {
        console.log("Error deleting role", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.put('/role/:id', async (req, resp) => {
    try {
        let data = await Role.updateOne({ _id: req.params.id }, { $set: req.body });
        resp.send(data);
    } catch (error) {
        console.log("Error updating role", error);
        resp.status(500).send({ message: "Internal server error" });
    }
});

// ------------Role Collection End Route------------------------

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Middleware for error handling
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
