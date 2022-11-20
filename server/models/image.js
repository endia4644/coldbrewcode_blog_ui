module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    fileName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    sequence: {
      type: DataTypes.STRING(106),
      allowNull: false,
    },
    saveYsno: {
      type: DataTypes.BOOLEAN,
      default: false,
      allowNull: false,
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return Image;
}