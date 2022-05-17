import { Request, Response, NextFunction } from "express";
import OrderProductIdUnifier from "../../Unifiers/OrderProductIdUnifier";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import TastamatService from "../../Services/TastamatService";
import {
    IBookCellRequest,
    IProduct,
    ITransferStatus,
    ITransferStatusResponse,
} from "../../Types/IProduct";
import { TypeOfCellChange } from "../../Enums/cellType";
import StatusTransferUnifier from "../../Unifiers/StatusTransferUnifier";
import CellBookUnifier from "../../Unifiers/CellBookUnifier";
import RetailerCRMService from "../../Services/RetailerCRMService";
import CellBookMethodUnifier from "../../Unifiers/CellBookMethodUnifier";

export default class RetailCRMController {
    
    public async updateStatus(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            const methodContainer: CellBookMethodUnifier =
                new CellBookMethodUnifier(request.body);

            if (methodContainer.method === TypeOfCellChange.book) {
                // В RetailCRM создаем одно кастомное поле типа справочник со статусами Тастамата "Вложено", "Выдано", "Изъято". + Статусы "Запрос на бронирование ячейки", "Ячейка забронирована", "Запрос на отмену бронирования ячейки", "Бронирование ячейки отменено".
                // body{ method:"book", identifier:"string", size:"L"|"M"|"S" }

                const { body }: { body: IBookCellRequest } = request;

                const cellBookUnifier: CellBookUnifier = new CellBookUnifier(
                    body
                );

                const service = IOC.make(TastamatService) as TastamatService;

                const result = await service.bookCell(cellBookUnifier);

                // const result: IBookCellResponse = {
                //     active: false,
                //     dropcode: "acsacsd",
                //     pickcode: "dcscsdcsd",
                //     status: ReserveStatus.RESERVED
                // };

                response.json(result);
            } else if (methodContainer.method === TypeOfCellChange.unbook) {
                // при изменении заказа на стороне RetailCRM на ОТМЕНЕН триггером отправляем запрос в сервис с перечнем параметров для отмены бронирования ячейки. Сервис идет в Tastsamat по API и отменяет бронь ячейки. После чего в RetailCRM отдает ответ - "Бронирование ячейки отменено".
                // body:{method:"unbook", identifier: "string"}

                const identifier: string = request.body?.identifier;
                const orderProductIdUnifier: OrderProductIdUnifier =
                    new OrderProductIdUnifier({ identifier });

                const service = IOC.make(TastamatService) as TastamatService;

                const result = await service.unbookCell(identifier);

                response.json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    public async checkStatus(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Передача информации о посылке Вашей IT-системы в Систему Тастамат
            // params: {identifer:"string"}

            const identifier: string = request.params?.identifier;

            const orderProductIdUnifier: OrderProductIdUnifier =
                new OrderProductIdUnifier({ identifier });

            const service: RetailerCRMService = IOC.make(RetailerCRMService);

            const result: IProduct | { message: string } =
                await service.getInform(orderProductIdUnifier.pkgIdentifier);
            // const result = {
            //     trackNumber: identifier,
            //     fullname: "Sam Ault",
            //     mobilePhone: "6464",
            //     address: "string 54",
            //     parcelValue: "656465465",
            //     lockerIndex: "456testlocker",
            // }; //for test
            response.json(result);
        } catch (error) {
            next(error);
        }
    }
    /**
     * statusTranfer
     */
    public async statusTranfer(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Передача статусов от Tastamat Opener в Вашу IT-систему
            // body :{   identifier: "string", status: "string", date:logn  }

            const body: ITransferStatus = request.body;
            const statusTranferUnifier: StatusTransferUnifier =
                new StatusTransferUnifier(body);
            const service: RetailerCRMService = IOC.make(RetailerCRMService);

            const result: ITransferStatusResponse | never =
                await service.updateStatus(statusTranferUnifier);

            response.json(result);
        } catch (error) {
            next(error);
        }
    }
}
