module.exports = (sequelize, DataTypes) => {
  const TempPost = sequelize.define(
    "TempPost",
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
      postThumbnail: {
        type: DataTypes.STRING(500),
        allowNull: true,
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
  TempPost.associate = (db) => {
    db.TempPost.belongsTo(db.Post);
  };
  return TempPost;
};
