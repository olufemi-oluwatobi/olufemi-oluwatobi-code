module.exports = function (sequelize, DataTypes) {
  const Subject = sequelize.define(
    "subject",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "subject",
      timestamps: false,
    }
  );
  Subject.associate = (models) => {
    Subject.belongsToMany(models.book, {
      as: "subjects",
      through: models.bookSubjects,
      foreignKey: "subjectId",
    });
  };
  Subject.createSubjects = (body) => {
    return Subject.bulkCreate(body, {
      updateOnDuplicate: ["title"],
    }).then((data) => data);
  };
  return Subject;
};
