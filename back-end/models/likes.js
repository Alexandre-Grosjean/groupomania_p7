'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {

    static associate({ Post }) {
      this.belongsTo(Post, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE'})
    }

  }
  Likes.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    userLike: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    userDislike: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    userId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    postUuid: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    tableName: 'likes',
    modelName: 'Likes',
  });
  return Likes;
};