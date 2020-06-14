module.exports = function (sequelize, DataTypes) {
  const BookSubject = sequelize.define(
    "bookSubjects",
    {
      subjectId: {
        type: DataTypes.STRING,
        primaryKey: false,
        references: {
          model: "subject",
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
      tableName: "bookSubjects",
      timestamps: false,
    }
  );
  BookSubject.associate = (models) => {
    BookSubject.belongsTo(models.subject, {
      foreignKey: "authorId",
      targetKey: "id",
      as: "authorsBooks",
    });
    BookSubject.belongsTo(models.book, {
      foreignKey: "bookId",
      targetKey: "id",
      as: "booksSubjects",
    });
  };
  BookSubject.createBookSubject = (body) => {
    return BookSubject.bulkCreate(body).then((data) => data);
  };

  return BookSubject;
};
