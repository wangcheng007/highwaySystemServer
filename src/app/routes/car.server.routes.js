import * as car from '../controllers/car.server.controller';

export default function(router) {

    router.get('/car/identificationCarInformation', car.identificationCarInformation);

    router.get('/car/initCar', car.initCar);

    router.get('/car/addCar', car.addCar);

    router.get('/car/updateCar', car.updateCar);

    router.get('/car/getDetailCar', car.getDetailCar);

    router.get('/car/getCarDetailByCar_Id', car.getCarDetailByCar_Id);
    
    router.get('/car/getCarAttributes', car.getCarAttributes);

    router.get('/car/updateCarInformation', car.updateCarInformation);
    return router;
}