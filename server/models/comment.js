module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentContent: {
      type: DataTypes.TEXT, // 매우 긴 글
      allowNull: false,
    },
    commentDepth: {
      type: DataTypes.TEXT, // 매우 긴 글
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); //UserId
    db.Comment.belongsTo(db.Post); //postNo
    db.Comment.belongsTo(db.Comment, { as: 'refComment', foreignKey: 'ParentId' }); //commentNo
  };
  return Comment;
}