import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';

export default (router: Router) => {
    router.post("/update",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            const {id, shapes,url } = req.body;
            try {
                const draw = await BlogModel.findByPk(id);
                if(!draw){
                    return res.status(200).send(new BaseError("Draw is not exist!", BaseError.Code.ERROR).release());
                }

                if(!shapes){
                    return res.status(200).send(new BaseError("Draw empty!", BaseError.Code.ERROR).release());
                }

                draw.data = JSON.stringify({
                    shapes: JSON.parse(shapes),
                    url: url
                });

                await draw.edit(["data"]);

                return res.status(200).send({
                    draw: draw.release(),
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};