import { UUID } from "crypto";

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