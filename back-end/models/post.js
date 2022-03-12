'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {

  
    static associate({ User, Likes }) {
      this.belongsTo(User, {foreignKey: 'userId', as: 'user'})
      this.hasMany(Likes, { foreignKey: 'postId', as: 'likes', onDelete: 'CASCADE'})
    };
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined }
    }
  }

  Post.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl : {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};