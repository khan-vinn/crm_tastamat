import { CellType } from "../Enums/cellType";
import { TastamatAPiRepositoryInterface } from "../Repositories/Tastamat/TastamatAPIRepositoryInterface";

export default class TastamatService {
    constructor(
        private tastamatAPiRepository: TastamatAPiRepositoryInterface
    ) {}

    public async checkStatus(id: string): Promise<any> {
        return this.tastamatAPiRepository.checkCellStatus(id);
    }

    public async unbookCell(identifier: string): Promise<any> {
        return this.tastamatAPiRepository.unbookCell(identifier);
    }

    public async bookCell({
        identifier,
        size = CellType["L"],
    }: {
        identifier: string;
        size: CellType;
    }): Promise<any> {
        return this.tastamatAPiRepository.bookCell(identifier, size);
    }

    public checkCellStatus(cellId: string): Promise<any> {
        return this.tastamatAPiRepository.checkCellStatus(cellId);
    }
}
