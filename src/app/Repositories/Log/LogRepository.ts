import Database from 'sosise-core/build/Database/Database';
import LogRepositoryInterface from './LogRepositoryInterface';
import { Knex } from 'knex';
import LoggerService from 'sosise-core/build/Services/Logger/LoggerService';

export default class LogRepository implements LogRepositoryInterface {

    private dbClient: Knex;

    /**
     * Constructor
     */
    constructor(private loggerService: LoggerService) {
        console.log("log")
        console.log(this);
        this.dbClient = Database.getConnection(process.env.DB_PROJECT_CONNECTION as string).client;
    }

    /**
     * Get all customers
     */
    public async getAllCustomers(): Promise<any> {
        // Get rows
        const customers = await this.dbClient
            .table('customers');

        return customers;
    }
}
