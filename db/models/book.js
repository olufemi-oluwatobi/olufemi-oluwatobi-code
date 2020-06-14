module.exports = function (sequelize, DataTypes) {
  const Book = sequelize.define(
    "book",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      publicationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      publisher: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "Gutenberg",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      language: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      licenseRights: {
        type: DataTypes.TEXT,
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
      tableName: "book",
    }
  );
  Book.associate = (models) => {
    Book.belongsToMany(models.author, {
      as: "author",
      through: models.bookAuthors,
      foreignKey: "authorId",
    });
    Book.belongsToMany(models.subject, {
      as: "subject",
      through: models.bookSubjects,
      foreignKey: "subjectId",
    });
  };
  Book.createBook = (body) => {
    return Book.create(body)
      .then((data) => data)
      .catch((err) => err);
  };

  return Book;
};
