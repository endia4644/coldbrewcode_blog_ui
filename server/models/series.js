module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('Series', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  Series.associate = (db) => {
    db.Series.hasMany(db.Post);
  }
  return Series;
}