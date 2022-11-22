module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      postContent: {
        type: DataTypes.TEXT, // 매우 긴 글
        allowNull: false,
      },
      postName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      postDescription: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      postThumnail: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      likeCnt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permission: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      dltYsno: {
        type: DataTypes.STRING(1),
        allowNull: false, //필수
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.belongsTo(db.Series, {
      foreignKey: {
        allowNull: true,
      },
    });
    db.Post.hasMany(db.Comment);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    db.Post.hasMany(db.Image);
  };
  return Post;
};
