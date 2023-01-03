/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId: userId,
      });
    }

    static async overdue(userId) {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") },
          userId: userId,
          completed: false,
        },

        order: [["id", "ASC"]],
      });
    }

    static async dueToday(userId) {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date().toLocaleDateString("en-CA") },
          userId: userId,
          completed: false,
        },

        order: [["id", "ASC"]],
      });
    }

    static async dueLater(userId) {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") },
          userId: userId,
          completed: false,
        },

        order: [["id", "ASC"]],
      });
    }

    static async completedTodo(userId) {
      return await Todo.findAll({
        where: {
          completed: true,
          userId: userId,
        },

        order: [["id", "ASC"]],
      });
    }

    static getTodos() {
      return this.findAll();
    }

    setCompletionStatus(bool) {
      var values = { completed: bool };
      return this.update(values);
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id: id,
          userId: userId,
        },
      });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
