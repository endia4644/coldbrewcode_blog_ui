module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    content: {
      type: DataTypes.TEXT, // 매우 긴 글
      allowNull: false,
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return Image;
}