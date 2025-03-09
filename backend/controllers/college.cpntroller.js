import { Student } from "../models/student.model.js";
import { User } from "../models/user.model.js";


const getStudentDetails = async (req, res) => {
    try {
        const { s_email } = req.body;

        if (!s_email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ _id: s_email });

        if (!user) {
            return res.status(404).json({ message: "Student not found" });
        }

        await user.populate('role');

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//svae edited details
const savedeiteddetails = async (req, res) => {
    try {
        const { s_email, name, course_progress, quiz_scores, grades, projects, certificate } = req.body;

        if (!s_email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: s_email });

        if (!user) {
            return res.status(404).json({ message: "Student not found" });
        }

        await user.populate('role');

        // Update user fields if provided
        if (name) user.name = name;

        if (user.role) {
            if (course_progress) {
                Object.keys(course_progress).forEach((key) => {
                    user.role.course_progress.set(key, course_progress[key]);
                });
            }

            if (quiz_scores) {
                Object.keys(quiz_scores).forEach((key) => {
                    user.role.quiz_scores.set(key, quiz_scores[key]);
                });
            }

            if (grades) {
                Object.keys(grades).forEach((key) => {
                    user.role.grades.set(key, grades[key]);
                });
            }

            if (projects) {
                Object.keys(projects).forEach((key) => {
                    user.role.projects.set(key, projects[key]);
                });
            }

            if (certificate) {
                user.role.certificate = certificate;
            }
        }

        await user.role.save(); // Save role updates
        await user.save(); // Save user updates

        res.status(200).json({ message: "Student details updated successfully", user });
    } catch (error) {
        console.error("Error updating student details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




//get college deatils
const getCollegeDetails = async (req, res) => {
    try {
        const { s_email } = req.body;

        if (!s_email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: s_email });

        if (!user) {
            return res.status(404).json({ message: "Student not found" });
        }

        await user.populate('role');

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {getCollegeDetails, getStudentDetails, savedeiteddetails}
