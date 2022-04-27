import { Request, Response } from "express";
import ExampleUserList from "../constants/ExampleUserList";

module.exports.getAllUsers = (req: Request, res: Response) => {
  res.json(ExampleUserList);
};

module.exports.getUser = (req: Request, res: Response) => {
  const user = ExampleUserList.find((User) => User.userID === req.params.id);
  user ? res.json(user) : res.send("user doesn`t exist");
};
