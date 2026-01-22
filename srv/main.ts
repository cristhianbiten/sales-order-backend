import { Customer, Customers } from "@models/sales";

const customer: Customer = {
    email: 'cristhian@teste.com',
    firstName: 'cristhian',
    lastName: 'bitencourt'
}

const customers: Customers = [customer];

const funcao = (variavel: string) => console.log(variavel);

funcao("oi");
