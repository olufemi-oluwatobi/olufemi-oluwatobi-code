const { v4: uuidV4 } = require("uuid");
module.exports = function (sequelize, DataTypes) {
  const Author = sequelize.define(
    "author",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "author",
    }
  );
  Author.associate = (models) => {
    Author.belongsToMany(models.book, {
      as: "authorBooks",
      through: models.bookAuthors,
      foreignKey: "authorId",
    });
  };
  Author.createAuthor = (body) => {
    return Author.bulkCreate(body, { updateOnDuplicates: ["id"] }).then(
      (data) => data
    );
  };
  return Author;
};
