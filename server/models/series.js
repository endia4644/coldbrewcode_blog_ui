module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('Series', {
    seriesName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  Series.associate = (db) => {
    db.Series.hasOne(db.SeriesPost);
  }
  return Series;
}