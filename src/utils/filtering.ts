import { UUID } from "crypto";
import bcrypt from 'bcrypt';
import logger from "./logger";

export const ObjectFiltering = ((data: object, filters: Array<string>): object => {
  return Object.keys(data)
    .filter(key => filters.includes(key))
    .reduce((obj: any, key: string) => {
        obj[key] = data[key as keyof typeof data];
        return obj;
    }, {});
  })


export const ObjectDifferences = ((data: object, comparative: Array<string>): Array<string> => {
  const keys: Array<string> = Object.keys(data);
  
  const diff1: Array<string> = [...keys].filter(key => !comparative.includes(key));
  const diff2: Array<string>= [...comparative].filter(key => !keys.includes(key));
  
  return [...diff1, ...diff2];
})

export const stringToUUID = (string: string): UUID | null => {

  const strings: string[] = string.split('-')
  if(strings.length === 5) {
      return `${strings[0]}-${strings[1]}-${strings[2]}-${strings[3]}-${strings[4]}`
  }

  return null

}

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "1234abcd";

export const encryptPassword = async (password?: string | undefined): Promise<string> => {
  const passwordValue: string = password ?? DEFAULT_PASSWORD
  let hashedPassword: string = passwordValue;

  return bcrypt
    .genSalt(PASSWORD_SALT)
    .then(async salt => {
      return bcrypt.hash(passwordValue, salt)
    })
    .then(hashed => hashed)
    .catch(err => {
      logger.error(err, console.error)
      return hashedPassword;
    })
}