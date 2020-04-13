import 'dotenv/config';

export default class DotenvStore {
  public static get(name: string) {
    return process.env[name];
  }
}