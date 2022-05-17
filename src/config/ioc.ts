import IOC from "sosise-core/build/ServiceProviders/IOC";
import RetailerCRMRepository from "../app/Repositories/RetailerCRM/RetailerCRMRepository";
import { TastamatAPIRepository } from "../app/Repositories/Tastamat/TastamatAPIRepository";
import RetailerCRMService from "../app/Services/RetailerCRMService";
import TastamatService from "../app/Services/TastamatService";
/**
 * IOC Config, please register here your services
 */
const iocConfig = {
    /**
     * Singleton services
     *
     * How to register:
     * YourServiceName: () => new YourServiceName()
     *
     * How to use:
     * const logger = IOC.makeSingleton(LoggerService) as LoggerService;
     */
    singletons: {},

    /**
     * Non singleton services
     *
     * How to register:
     * YourServiceName: () => new YourServiceName()
     *
     * How to use:
     * const logger = IOC.make(LoggerService) as LoggerService;
     */
    nonSingletons: {
        TastamatService: () => new TastamatService(new TastamatAPIRepository()),
        RetailerCRMService: () =>
            new RetailerCRMService(new RetailerCRMRepository()),
        /**
         * This service is included in the core out of the box
         * If you want to override LoggerService just uncomment this code and import all necessary modules
         */
        // LoggerService: () => {
        //     if (process.env.APP_ENV === 'local') {
        //         return new LoggerService(new LoggerPrettyConsoleRepository());
        //     }
        //     return new LoggerService(new LoggerJsonConsoleRepository());
        // }
    },
};

export default iocConfig;
