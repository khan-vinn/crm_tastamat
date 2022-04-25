import LogRepositoryInterface from "../Repositories/Log/LogRepositoryInterface";
import { TastamatAPiRepositoryInterface } from "../Repositories/Tastamat/TastamatAPIRepositoryInterface";
import { ITransferStatus } from "../Types/IProduct";

export default class TastamatService {
    private tastamatAPiRepository: TastamatAPiRepositoryInterface;
    private loggerService: LogRepositoryInterface;

    constructor(tastamatAPiRepository: TastamatAPiRepositoryInterface, loggerSerice: LogRepositoryInterface) {
        this.tastamatAPiRepository = tastamatAPiRepository;
        this.loggerService = loggerSerice;
        console.log("service");
    }

    public checkStatus(id: string): Promise<any> {

        return this.tastamatAPiRepository.checkCellStatus(id);

    }

    public cancelOrderCell(orderId): Promise<any> {
        return this.tastamatAPiRepository.cancelOrderCell(orderId);
    }

    public bookCell({ cellId, status }: { cellId: string, status: string }): Promise<any> {
        return this.tastamatAPiRepository.bookCell(cellId, status);
    }

    public checkCellStatus(cellId: string): Promise<any> {
        return this.tastamatAPiRepository.checkCellStatus(cellId);
    }

    public checkPkgById(id: string): Promise<any> {
        return this.tastamatAPiRepository.checkPkgById(id);
    }

    public statusTransfer(status: ITransferStatus): Promise<any> {
        return this.tastamatAPiRepository.statusTransfer(status);
    }

}
