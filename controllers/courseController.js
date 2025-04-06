const Course = require('../models/Course');
const User = require('../models/User');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const instructorId = req.auth.sub;
    const instructor = await User.findById(instructorId);

    if (!instructor || instructor.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can create courses' });
    }

    const course = new Course({
      ...req.body,
      instructor: instructorId
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, level, instructor } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (level) query.level = level;
    if (instructor) query.instructor = instructor;

    const courses = await Course.find(query)
      .populate('instructor', 'firstname lastname profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get course by ID
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'firstname lastname profileImage')
      .populate('enrolledStudents.student', 'firstname lastname profileImage');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.auth.sub) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.assign(course, req.body);
    await course.save();

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.auth.sub) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.remove();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const studentId = req.auth.sub;

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === studentId
    );

    if (isEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add student to enrolled students
    course.enrolledStudents.push({
      student: studentId,
      enrolledAt: new Date()
    });

    await course.save();
    res.status(200).json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// Update course progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { topicIndex, completed } = req.body;
    const studentId = req.auth.sub;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === studentId
    );

    if (!enrollment) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    // Update progress for the specific topic
    if (!enrollment.progress[`topic${topicIndex}`]) {
      enrollment.progress[`topic${topicIndex}`] = {
        completed: false,
        completedAt: null
      };
    }

    enrollment.progress[`topic${topicIndex}`].completed = completed;
    if (completed) {
      enrollment.progress[`topic${topicIndex}`].completedAt = new Date();
    }

    await course.save();
    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// Add course review
exports.addReview = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const studentId = req.auth.sub;

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student is enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === studentId
    );

    if (!isEnrolled) {
      return res.status(400).json({ message: 'Must be enrolled to review the course' });
    }

    const { rating, comment } = req.body;

    course.reviews.push({
      student: studentId,
      rating,
      comment
    });

    // Update course rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating = totalRating / course.reviews.length;

    await course.save();
    res.status(200).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
}; 