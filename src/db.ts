import { Config, JsonDB } from "node-json-db";

const miner = new JsonDB(new Config("db/miner", true, true, "/"));

export const DataBase = {
  miner: miner,
};
