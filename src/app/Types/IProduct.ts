import { CellType } from "../Enums/cellType"
import HttpResponse from 'sosise-core/build/Types/HttpResponse';

export interface IProduct {
    customerPhone: string
    customerFullName: string
    productId: number
    indexPostamat: number
    typeOfDeleveryCell: CellType
}    
