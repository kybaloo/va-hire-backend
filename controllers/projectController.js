const Project = require('../models/Project')

exports.createProject = async (req, res) => {
    try {
        const {title, description} = req.body;
        const project = new Project({ title, description, owner: req.userId });
        await project.save();
        res.status(201).json(project);
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
};

exports.getProjects = async (req, res) => {
    try{
        // const projects = await Project.find({ owner: req.userId });
        const projects = await Project.find();
        res.status(200).json(projects);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getOneProject = (req, res) => {
    Project.findOne({
        _id: req.params.id
    }).then(
        (project) => {
          res.status(200).json(project);
        }
    ).catch(
        (error) => {
            res.status(404).json({
            error: error
            });
        }
    );
}

exports.updateProject = async (req, res) => {
    try {
        const { title, description, assignedTo, status } = req.body;
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { title, description, assignedTo, status },
            { new: true }
        );
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
