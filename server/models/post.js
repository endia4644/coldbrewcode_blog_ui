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
      permission: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      commentCount: {
        type: DataTypes.VIRTUAL(DataTypes.INTEGER),
        set(value) {
          this.setDataValue("commentCount", value);
        },
      },
      likeYsno: {
        type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
        set(value) {
          this.setDataValue("likeYsno", value);
        },
      },
      likeCount: {
        type: DataTypes.VIRTUAL(DataTypes.INTEGER),
        set(value) {
          this.setDataValue("likeCount", value);
        },
      },
      next: {
        type: DataTypes.VIRTUAL,
        set(value) {
          this.setDataValue("next", value);
        },
      },
      prev: {
        type: DataTypes.VIRTUAL,
        set(value) {
          this.setDataValue("prev", value);
        },
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
    db.Post.belongsToMany(db.User, { through: "PostLikeUser" });
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
