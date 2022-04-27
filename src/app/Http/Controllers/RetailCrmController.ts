import { Request, Response, NextFunction } from 'express';
import OrderProductIdUnifier from '../../Unifiers/OrderProductIdUnifier';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import TastamatService from '../../Services/TastamatService';
import { IBookCellRequest, IBookCellResponse, IProduct, ITransferStatus, ITransferStatusResponse, IUnbookCellResponse } from '../../Types/IProduct';
import { ReserveStatus, ResultStatus, TypeOfChange } from '../../Enums/cellType';
import StatusTransferUnifier from '../../Unifiers/StatusTransferUnifier';
import CellBookUnifier from '../../Unifiers/CellBookUnifier';
import RetailerCRMService from '../../Services/RetailerCRMService';

export default class RetailCRMController {

    public async updateStatus(request: Request, response: Response, next: NextFunction) {

        try {

            if (request?.body?.method?.toString() === TypeOfChange.book) {

                const { body }: { body: IBookCellRequest } = request;
                console.log(body);
                const cellBookUnifier: CellBookUnifier = new CellBookUnifier(body);

                // const service = IOC.make(TastamatService) as TastamatService;

                const result: IBookCellResponse = {
                    active: false,
                    dropcode: "acsacsd",
                    pickcode: "dcscsdcsd",
                    status: ReserveStatus.RESERVED
                };
                response.json(result);

                return;

            } else if (request?.body?.method?.toString() === TypeOfChange.unbook) {

                const identifier: string = request.body?.identifier;
                const orderProductIdUnifier: OrderProductIdUnifier = new OrderProductIdUnifier({ identifier });
                // const service = IOC.make(TastamatService) as TastamatService;
                const result: IUnbookCellResponse = {
                    active: true,
                    status: ReserveStatus.UNRESERVED
                };

                response.json(result);

                return;

            }

            // const responseService = await service.checkStatus(orderProductIdUnifier.orderId);
            // console.log(responseService);

        } catch (error) {

            next(error);

        }
    }

    public async checkStatus(request: Request, response: Response, next: NextFunction) {
        try {

            const identifier: number = +request.params.identifier;
            const orderProductIdUnifier: OrderProductIdUnifier = new OrderProductIdUnifier({ identifier });

            const service: RetailerCRMService = IOC.make(RetailerCRMService);

            const result: IProduct | { message: string } = await service.getInform(orderProductIdUnifier.pkgIdentifier);

            // const result: IProduct = {
            //     address: "some",
            //     fullName: "ANN",
            //     lockIndex: "saasd4545879",
            //     mobilePhone: "46465465",
            //     parcerValue: 79879879798.6654,
            //     trackNumber: identifier
            // };

            console.log(result);

            response.json({ message: result });

        } catch (error) {

            next(error);

        }
    }
    /**
     * statusTranfer
     */
    public async statusTranfer(request: Request, response: Response, next: NextFunction) {

        try {

            const body: ITransferStatus = request.body;
            const statusTranferUnifier: StatusTransferUnifier = new StatusTransferUnifier(body);
            const service: RetailerCRMService = IOC.make(RetailerCRMService);

            const result: ITransferStatusResponse | null = await service.updateStatus(statusTranferUnifier);

            // const result: ITransferStatusResponse = {
            //     "result": (+new Date()).toString(),
            //     "identifier": +statusTranferUnifier.identifier,
            //     "status": ResultStatus.SUCCESS
            // };

            console.log(result);
            response.json(result);

        } catch (error) {

            next(error);

        }
    }

}
