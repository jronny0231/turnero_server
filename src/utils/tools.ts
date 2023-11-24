import { middlewaresType } from "../@types/global";
import { authToken } from "../middlewares/activeToken.middlewares";
import { validateActiveUser, validatePermission } from "../middlewares/activeUser.middlewares";


export const middlewares = (slug?: string): middlewaresType => {

    return slug ?
        [authToken, validateActiveUser, validatePermission(slug)]
        : [authToken, validateActiveUser]
};