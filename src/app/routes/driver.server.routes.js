import * as driver from '../controllers/driver.server.controller';

export default function(router) {

    router.get('/driver/identificationDriverIdCardInformation', driver.identificationDriverIdCardInformation);

    router.get('/driver/identificationLicsenceCardInformation', driver.identificationLicsenceCardInformation);
    
    router.get('/driver/addDriver', driver.addDriver);

    router.get('/driver/getDrivers', driver.getDrivers);

    router.get('/driver/getDriverById', driver.getDriverById);

    return router;
}