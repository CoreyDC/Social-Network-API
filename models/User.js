const { Schema, model } = require('mongoose');

// SCHEMA TO CREATE USER MODEL 
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/],
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thoughts',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: {
          virtuals: true,
        },
        id: false,
    }
);

// VIRTUAL THAT RETRIEVES LENGTH OF USERS FRIENDS ARRAY FIELD ON QUERY
userSchema
    .virtual("friendCount")
    .get(function () {
        return this.friends.length;
    });

const User = model("User", userSchema);

module.exports = User;