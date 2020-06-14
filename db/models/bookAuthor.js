module.exports = function (sequelize, DataTypes) {
  const BookAuthor = sequelize.define(
    "bookAuthors",
    {
      authorId: {
        type: DataTypes.STRING,
        primaryKey: false,
        references: {
          model: "author",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        unique: "unique-author-per-book",
      },
      bookId: {
        type: DataTypes.STRING,
        primaryKey: false,
        references: {
          model: "book",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        unique: "unique-author-per-book",
      },
    },
    {
      tableName: "bookAuthors",
      timestamps: false,
    }
  );
  BookAuthor.associate = (models) => {
    BookAuthor.belongsTo(models.author, {
      foreignKey: "authorId",
      targetKey: "id",
      as: "authors",
    });
    BookAuthor.belongsTo(models.book, {
      foreignKey: "bookId",
      targetKey: "id",
      as: "books",
    });
  };
  BookAuthor.createBookAuthors = (body) => {
    return BookAuthor.bulkCreate(body).then((data) => data);
  };

  return BookAuthor;
};
