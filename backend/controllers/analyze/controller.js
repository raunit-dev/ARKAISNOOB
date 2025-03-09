import { User } from "../../models/user.model.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import axios from "axios";
dotenv.config()

const secret_Key = process.env.JWT_SECRET
const api_key = process.env.API_KEY

if (!process.env.JWT_SECRET) {
    console.log("secret key is not defined")
    process.exit(1)
}


const analyze = async (req,res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret_Key);
    const userId = decoded.userId;

    const fetchedUser = await User.findById(userId)
    await fetchedUser.populate('role')

    console.log(fetchedUser)

    const prompt = `
        Analyze this student’s academic performance and identify skill gaps:
    Course Progress: ${JSON.stringify(fetchedUser.role.course_progress)}
    Quiz Scores: ${JSON.stringify(fetchedUser.role.quiz_scores)}
    Grades: ${JSON.stringify(fetchedUser.role.grades)}
    Project Submissions: ${JSON.stringify(fetchedUser.role.projects)}
    
    Give a performance score (out of 100), skill gaps, and learning recommendations.
    Also, write strengths, what the student is good at, and appreciate it.
    Keep this precise and easy to understand, not in a long paragraph format.

    Dont start with okay, start with here is your analysis then start
    `

    const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        },
        {
          params: { key: api_key },
          headers: { "Content-Type": "application/json" },
        }

    )

    console.log(response.data)
    return res.status(200).send({message:response.data.candidates[0].content.parts[0].text})
}

export {analyze}