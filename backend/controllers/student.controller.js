import { Student } from "../models/student.model.js";
import { User } from "../models/user.model.js";

const getStudentDetails = async (req, res) => {
    try {
        const { s_email } = req.body;

        if (!s_email) {
            return res.status(400).json({ error: "Student email is required." });
        }

        const fetchedStudent = await User.findOne({ email: s_email });

        if (!fetchedStudent) {
            return res.status(404).json({ error: "Student not found." });
        }

        await fetchedStudent.populate('role')
        return res.status(200).json({ student: fetchedStudent });

    } catch (error) {
        console.error("Error fetching student details:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export { getStudentDetails};
