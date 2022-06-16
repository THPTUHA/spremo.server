import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { UserModel } from '../../../models/user/user';
import { time, wrapAsync } from '../../../services/helper';
import { RecordModel } from '../../../models/record/Record';

export default (router: Router) => {
    router.post("/record",multer({}).fields([]), passport.authenticate('jwt', { session: false }),
        wrapAsync( async(req, res)=>{
            try {
                if(req.user){
                    const user = req.user as UserModel;
                    let {range} = req.body;
                    const records = await RecordModel.findAll({
                        where:{
                            since: JSON.parse(range),
                        }
                    })
                    res.status(200).send({
                        records: records.map(record => record.release()),
                        code: BaseError.Code.SUCCESS
                    });
                }
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};