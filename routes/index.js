var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

/* LOCAL */
// mongoose.connect("mongodb://localhost:27017/studentdb");

/* ATLAS */
mongoose.connect(
  "mongodb+srv://01057158:cRTP1gvFyRhpeNYd@studentdb.mv1ct.mongodb.net/studentdb?retryWrites=true&w=majority&appName=studentdb"
); // 連結雲端Atlas

const db = mongoose.connection;

// 與資料庫連線發生錯誤時
db.on("error", console.error.bind(console, "Connection fails!"));

// 與資料庫連線成功連線時
db.once("open", function () {
  console.log("Connected to database...");
});

// 該collection的格式設定
const studentSchema = new mongoose.Schema({
  name: {
    type: String, //設定該欄位的格式
    required: true, //設定該欄位是否必填
  },
  age: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("students", studentSchema);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// 取得全部資料
// 使用非同步，才能夠等待資料庫回應
/* GET student data */
router.get("/students", async (req, res) => {
  // 使用try catch方便Debug的報錯訊息
  try {
    // 找出data資料資料表中的全部資料
    const data = await Student.find();
    // 將回傳的資訊轉成Json格式後回傳
    res.json(data);
  } catch (err) {
    // 如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息
    res.status(500).json({ message: err.message });
  }
});

// 新增待辦事項
// 將Method改為Post
/* POST student data */
router.post("/students", async (req, res) => {
  // 從req.body中取出資料
  const student = new Student({
    name: req.body.name,
    age: req.body.age,
    grade: req.body.grade,
  });
  try {
    // 使用.save()將資料存進資料庫
    const data = await student.save();
    // 回傳status:201代表新增成功 並回傳新增的資料
    res.status(201).json(data);
  } catch (err) {
    // 錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
    res.status(400).json({ message: err.message });
  }
});

// 刪除代辦事項
router.delete("/students/:id", async (req, res) => {
  try {
    // 將取出的代辦事項刪除
    await Student.findByIdAndDelete(req.params.id);
    // 回傳訊息
    res.json({ message: "Delete todo successfully!" });
  } catch (err) {
    // 資料庫操作錯誤將回傳500及錯誤訊息
    console.log(err);
    res.status(500).json({ message: "remove todo failed!" });
  }
});

// 更新代辦事項
router.put("/students/:id", async (req, res) => {
  try {
    // 將取出的代辦事項更新
    const data = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(data);
  } catch (err) {
    // 資料庫操作錯誤將回傳500及錯誤訊息
    res.status(500).json({ message: "update todo failed!" });
  }
});

module.exports = router;
