const { Schema, model } = require('mongoose');

// CREATING REACTION SCHEMA ( SUBDOCUMENT SCHEMA TO THOUGHT SCHEMA )
const reactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(), 
      },
  
      reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
      },
  
      username: {
        type: String,
        required: true,
      },
  
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      toJSON: {
        getters: true,
      },
      id: false,
    }
  );

  // SCHEMA TO CREATE THOUGHT MODEL
 const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        max_length: 280, 
        minlength: 1,
      },
      createdAt: {
         type: Date,
         default: Date.now,
    },
      username: { 
        type: String,
        required: true,
      },
        reactions: [reactionSchema],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false,
    }
  );


  // VIRTUAL THAT RETRIEVES LENGTH OF THOUGHTS REACTIONS ARRAY FIELD ON QUERY
  thoughtSchema
    .virtual("reactionCount")
    .get(function () {
        return this.reactions.length;
    });

    const Thought = model('Thought', thoughtSchema);

    module.exports = Thought;