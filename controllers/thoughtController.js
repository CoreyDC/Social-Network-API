const { Thought, User } = require('../models');

const thoughtController = {
    // CREATE A THOUGHT
    createThought(req, res) {
        Thought.create(req.body)
          .then((dbThoughtData) => {
            return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: dbThoughtData._id } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'Thought created but no user with this id' });
            }
    
            res.json({ message: 'Thought created!' });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },

      // GET ALL THOUGHTS
      getThoughts(req, res) {
        Thought.find()
          .sort({ createdAt: -1 })
          .then((dbThoughtData) => {
            res.json(dbThoughtData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },

      // GET SINGLE THOUGHT BY Id
      getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'Thought with this ID does not exist.' });
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },

      // UPDATE A THOUGHT
      updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'Thought with this ID does not exist.' });
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },
    
      // DELETE A THOUGHT
      deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'Thought with this ID does not exist.' });
            }
    
            // REMOVE ID FROM THOUGHTS FIELD
            return User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'Thought has been created but no user with this id!' });
            }
            res.json({ message: 'Thought has been deleted!' });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },
    
      // ADD REACTION TO THOUGHT
      addReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'User with this ID does not exist.' });
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },
    
      // REMOVE REACTION FROM THOUGHT
      removeReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'Thought with this ID does not exist.' });
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },
    
}

module.exports = thoughtController;