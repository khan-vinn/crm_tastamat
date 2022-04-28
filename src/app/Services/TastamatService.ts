import LogRepositoryInterface from "../Repositories/Log/LogRepositoryInterface";
import { TastamatAPiRepositoryInterface } from "../Repositories/Tastamat/TastamatAPIRepositoryInterface";

export default class TastamatService {

    constructor(
        private tastamatAPiRepository: TastamatAPiRepositoryInterface,
        private loggerSerice: LogRepositoryInterface
    ) { }

    public checkStatus(id: string): Promise<any> {

        return this.tastamatAPiRepository.checkCellStatus(id);

    }

    public cancelOrderCell(identifier: string): Promise<any> {
        return this.tastamatAPiRepository.cancelOrderCell(identifier);
    }

    public bookCell({ cellId, status }: { cellId: string, status: string }): Promise<any> {
        return this.tastamatAPiRepository.bookCell(cellId, status);
    }

    public checkCellStatus(cellId: string): Promise<any> {
        return this.tastamatAPiRepository.checkCellStatus(cellId);
    }

}
