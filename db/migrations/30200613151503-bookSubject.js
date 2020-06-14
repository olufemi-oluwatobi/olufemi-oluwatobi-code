"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("bookSubjects", {
      subjectId: {
        type: Sequelize.STRING,
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
        type: Sequelize.INTEGER,
        primaryKey: false,
        references: {
          model: "book",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        unique: "unique-author-per-book",
      },
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("bookSubjects");

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
