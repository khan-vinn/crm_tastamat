import Axios, { AxiosInstance } from 'axios';
import CryptoJS from 'crypto-js';
import { TastamatAPiRepositoryInterface } from './TastamatAPIRepositoryInterface';
import Lodash from 'lodash';
import Qs from 'qs';
import Helper from 'sosise-core/build/Helper/Helper';
import TastamatRequestExeption from '../../Exceptions/Tastamat/TastamatRequestExeption';
import { tastamatConfig } from '../../../config/APiConfig';
import { CellType } from '../../Enums/cellType';

export class TastamatAPIRepository implements TastamatAPiRepositoryInterface {
    static MAX_SEND_RETRIES = 3;
    static DELAY_BETWEEN_RETRIES_IN_MS = 3000;
    static API_PREFIX = '/platform/v1/rest/i';

    httpClient: AxiosInstance;

    constructor() {
        this.httpClient = Axios.create({
            baseURL: tastamatConfig.baseURL,
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
            }
        });
    }

    async checkCellStatus(id: string): Promise<any> {
        return await (+id * 21 + 87 - (+id) * 42);
    }

    async bookCell(identifier: string, size: CellType = CellType["S"]): Promise<any> {

        const body = {
            "identifier": identifier,
            "size": size
        };

        const headers = {
            'x-hmac': this.generateHeader(body) as string,
            'x-hmac-key': tastamatConfig.KEY as string
        };

        console.log(headers['x-hmac']);

        const result = this.makeRequest(TastamatAPIRepository.API_PREFIX + '/orders/book', "POST", null, body, headers);

        return result;


    }

    async unbookCell(identifier: string): Promise<any> {

        const body = {
            "identificator": identifier
        };
        const headers = { "x-hmac": this.generateHeader(body) };

        await this.makeRequest(TastamatAPIRepository.API_PREFIX + '/orders/unbook', "POST", null, body, headers);

        return await 0;
    }

    private generateHeader(message: any, token: string = tastamatConfig.TOKEN as string): string {

        // const hmac = crypto.createHmac('sha256', Buffer.from(token, 'utf-8')).update(JSON.stringify(message)).digest().toString('base64');
        // return hmac;
        const hash = CryptoJS.HmacSHA256(JSON.stringify(message), token);

        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

        return hashInBase64;
    }

    private async makeRequest(url: string, method: "GET" | "DELETE" | "POST" | "PUT", params: any = null, body: any = null, headers: any = null, auth: any = null,): Promise<any> {
        // Current amount of tries
        let tries = 0;

        // Try to send get request in endless loop
        while (true) {
            // Increment try
            tries++;

            try {
                // Make request
                const response = await this.httpClient.request({
                    url,
                    auth,
                    method,
                    headers,
                    params,
                    paramsSerializer(par: any) {
                        return Qs.stringify(par, { arrayFormat: 'brackets' });
                    },
                    data: body
                });
                // Send response, everything is fine
                return response;
                // Check for max tries
            } catch (error) {
                if (tries === TastamatAPIRepository.MAX_SEND_RETRIES) {
                    throw new TastamatRequestExeption(
                        `Maximum amount of ${TastamatAPIRepository.MAX_SEND_RETRIES} tries is reached while requesting CRM`,
                        url,
                        params,
                        Lodash.get(error, 'response.data', '')
                    );
                }

                // Wait some time
                await Helper.sleep(TastamatAPIRepository.DELAY_BETWEEN_RETRIES_IN_MS);
            }
        }
    }
}