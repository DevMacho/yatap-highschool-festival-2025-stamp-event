import express from "express";       // 서버 프레임워크
import mongoose from "mongoose";    // MongoDB ODM
import path from "path";            // 경로 관리
import { fileURLToPath } from "url";
import { boothStampMap } from "../stampVerificationList.js";

// ES Module 환경에서 __dirname 대체
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname)

const app = express();
app.use(express.json()); // JSON 요청 허용
app.use(express.static(path.join(__dirname, "public"))); // public 폴더를 정적 웹폴더로 사용

// ------------------- MongoDB 연결 -------------------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.error(err));

// 사용자 Schema (studentId는 중복 가능하지만 필요시 unique로 변경 가능)
const userSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    stamp: { type: [Number], default: [] } // 101~210 저장하는 자리 // 스탬프 진행 상태 저장 가능
});

const User = mongoose.model("User", userSchema);

// ------------------- API: 유저 등록 -------------------
app.post("/api/register", async (req,res)=>{
    const { studentId,name } = req.body;
    // 학번 + 이름이 모두 일치하는 유저 검색
    const exists = await User.findOne({ studentId, name });

    // 이미 존재하면 → 생성하지 않고 다른 코드로 응답
    if (exists) {
        return res.status(200).json({ message: "이미 존재하는 유저입니다. 오류 발생에 관한 문의는 본관 1층 학생회실에 문의해주세요.", exists: true });
    }

    // 존재하지 않으면 새로 생성
    await User.create({ studentId, name });

    return res.status(200).json({ message: "등록완료", created: true });
});

// GET : 유저 스탬프 조회
app.get("/api/stamp/:studentId", async (req, res) => {
  try {
    const user = await User.findOne({ studentId: req.params.studentId });

    if (!user) return res.json({ success:false, message:"사용자가 확인되지 않습니다. 오류 발생에 관한 문의는 본관 1층 학생회실에 문의해주세요." });

    return res.json({ success:true, stamps:user.stamp });
  } catch (e) {
    res.status(500).json({ success:false, error:e.message });
  }
});

// -----------스탬프 찍기----------------------------
app.post("/api/stamp/add", async (req,res)=>{
  try{
    const { code, studentId, name } = req.body;

    // 1️⃣ 인증 코드 검증
    if(!boothStampMap[code]){
      return res.json({ success:false, message:"유효하지 않은 인증 코드입니다. 오류 발생에 관한 문의는 본관 1층 학생회실에 문의해주세요." });
    }

    const stampNumber = boothStampMap[code];

    // 2️⃣ 유저 찾기 (학번 + 이름 완전 일치)
    const user = await User.findOne({ studentId, name });
    if(!user){
      return res.json({ success:false, message:"해당 학번과 이름의 유저가 존재하지 않습니다. 오류 발생에 관한 문의는 본관 1층 학생회실에 문의해주세요." });
    }

    // 3️⃣ 이미 찍힌 스탬프인지 체크
    if(user.stamp.includes(stampNumber)){
      return res.json({ success:false, message:"이미 스탬프가 찍힌 부스입니다. 오류 발생에 관한 문의는 본관 1층 학생회실에 문의해주세요." });
    }

    // 4️⃣ stamp 추가
    user.stamp.push(stampNumber);
    await user.save();

    return res.json({ success:true, message:"스탬프가 성공적으로 추가되었습니다.", stamp:user.stamp });
  
  }catch(e){
    return res.status(500).json({ success:false, message:e.message });
  }
});

// 전체 유저 조회
app.get("/api/users", async(req,res)=>{
    const users = await User.find({});
    res.json({success:true, users});
});

// 단일 유저 조회 (학번)
app.get("/api/user/:studentId", async(req,res)=>{
    const user = await User.findOne({studentId:req.params.studentId});
    if(!user) return res.json({success:false});
    res.json({success:true, user});
});

// ------------------- 서버 실행 -------------------
module.exports = app;