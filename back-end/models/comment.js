'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User, Post }) {
      this.belongsTo(User, {foreignKey: 'userId', as: 'userComment'})
      this.belongsTo(Post, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE'})
    }
  }
  Comment.init({
    body: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    tableName: 'comment',
    modelName: 'Comment',
  });
  return Comment;
};