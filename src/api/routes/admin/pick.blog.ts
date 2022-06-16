import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { UserModel } from '../../../models/user/user';
import {ROLES, SELECTED} from '../../../Constants';
import {time} from '../../../services/helper';
export default (router: Router) => {
    router.post("/pick.blog",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {id} = req.body;

                const user = req.user as UserModel;
                if(!user || (!user.is(ROLES.ADMIN) && !user.is(ROLES.CENSOR))){
                    return res.status(200).send(new BaseError("You have no right!", BaseError.Code.ERROR).release());
                }
                const blog = await BlogModel.findByPk(id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }

               blog.selected =   blog.selected == SELECTED ? 0 : SELECTED;
               blog.selected_since = time();

               await blog.edit(["selected","selected_since"])

                return res.status(200).send({
                    message: "Pick successful",
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};