import { ObjectId } from "mongodb";
import { MOrganization, TTodo, TTodoUpdateOptions } from "../models/todo.model";
import { getDB } from "../utils/mongo";

export default class TodoRepo {
  static collection() {
    return getDB().collection("tasks");
  }

  static async createTask(organization: TTodo) {
    return this.collection().insertOne(new MOrganization(organization));
  }

  static async update(task: TTodoUpdateOptions) {
    try {
      task._id = new ObjectId(task._id);
    } catch (error) {
      return Promise.reject("Invalid organization id.");
    }
    const { title, description } = task;
    const updatedAt = new Date();
    return this.collection().updateOne({ _id: task._id }, { $set: { title, description, updatedAt } });
  }

  static async delete(_id: string | ObjectId) {
    try {
      _id = new ObjectId(_id);
    } catch (error) {
      return Promise.reject("Invalid task id.");
    }

    try {
      await this.collection().deleteOne({ _id: new ObjectId(_id) });
      return Promise.resolve("Successfully deleted task.");
    } catch (error) {
      return Promise.reject("Server internal error.");
    }
  }
}
