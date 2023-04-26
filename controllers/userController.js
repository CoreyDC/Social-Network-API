const { User, Thought } = require('../models')

// Require Users Model
const {Users} = require('../models');

const userController = {
    
    // CREATE NEW USER
    createUser(req, res) {
        User.create(req.body)
          .then((dbUserData) => {
            res.json(dbUserData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
    },

    // GET ALL USERS
    getUsers(req, res) {
        User.find()
          .select('-__v')
          .then((dbUserData) => {
            res.json(dbUserData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },

    // GET SINGLE USER BY ID
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
          .select('-__v')
          .populate('friends')
          .populate('thoughts')
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'User with this ID does not exist.' });
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            res.status(500).json(err);
        });
      },

    // UPDATE A USER
    updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          {
            $set: req.body,
          },
          {
            runValidators: true,
            new: true,
          }
        )
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'User does not exist' });
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },

    // DELETE USERS THOUGHTS
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'No user with this id!' });
            }
    
            // GET USER ID AND DELETE THOUGHTS
            return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
          })
          .then(() => {
            res.json({ message: 'Users thoughts deleted!' });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },
    
      // ADD A FRIEND
      addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'User with this ID does not exist.' });
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },
      // REMOVE A FRIEND
      removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'User with this ID does not exist.' });
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      },
    };    

module.exports = userController; 