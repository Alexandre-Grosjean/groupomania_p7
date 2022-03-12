'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User }) {
      // define association here
      //userId
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
    }

    toJSON(){
      return { ...this.get(), id: undefined, userId: undefined }
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
    postId: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    tableName: 'likes',
    modelName: 'Likes',
  });
  return Likes;
};