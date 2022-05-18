import expressLoader from '../loaders/express';
import schemaLoader from '../loaders/schema';
import passportLoader from '../loaders/passport';
import Mailer from '../packages/mailer/Mailer';
import mongoLoader from '../loaders/mongo';

export default async ({expressApp}) => {
    await Mailer.init();
    try {
        await schemaLoader();
        await mongoLoader();
    } catch(err) {
        console.log(err.message);
    }
    await expressLoader({app: expressApp});
    await passportLoader({app: expressApp});
};