import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import { wrapAsync ,castToNumber} from '../../../services/helper';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/user.list",
        wrapAsync(async(req, res)=>{
            try {
                const {option, page, page_size} = req.body;
                let users = [];
                if(option == "top"){
                    users = await UserModel.paginate({
                        order: [["follower_number","DESC"]]
                     },{page: 1, page_size: 10})
                }

                return res.status(200).send({
                    following: [],
                    friends: [],
                    users: users.map(user => user.release()),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};