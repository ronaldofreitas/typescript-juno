import axios from 'axios';

export interface Address {
    street: string;
    number: string;
    city: string;
    state: string;
    postCode: string;
}

export interface Charge {
    descricao: string;
    valor_cobranca: number;
    recipient_token_destino: string;
    nome_comprador: string;
    documento_comprador: string;
    tipo_pagamento: Array<string>;
}

export default class Juno {

    Access_Token:string;
    url_base_pay:string;
    X_Api_Version:number;
    X_Resource_Token_More:string;
    Basic_Auth:string;
    My_Recipient_Token:string

    constructor() {
        this.Access_Token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJpbnRlZ3JhY2FvQHRoc3RlY25vbG9naWEuY29tLmJyIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTU5NzUxNjE0OSwianRpIjoiNTVhNDQyMmEtMDVlZC00NDE5LWJkYWItMTM3Y2ZkNjdkZmRlIiwiY2xpZW50X2lkIjoiWGR5b3k5T2wybjNRWGthbiJ9.OHWBvJoUykn3v4n4L05ew5H3wllW8uOtaAG02xOF4Xtv3pdtJFt4v6vY6OeaqG98j0DVvOJHioZw8Tic2gw-DeixsVyCPorNJeVFbB3pnFnr1fHrnBRqCYm2PDKIvaq9byGspFjEXUH1qSc60Za9gH3pFZSorTrNJUnHBf8-3G1slQiG2eXpiD7PBNK-WqGSWmxwYXoDGiMvBFT_xdquMGIq9otCv_a0n3ZPcZ--VS5mB3YSZNaXIY8wLBCXYVLwCBjZEX6rhSXlG_qJpm5ZYJ9abA1kRYr_ohhmC9-f7XTQctdDYCrqKpQeY3uY99d3JQIZj_QPz58JyiDZMa-e-Q';
        this.url_base_pay = 'https://sandbox.boletobancario.com';
        this.X_Resource_Token_More = '3A0EEA171E5168286DE02A7FB8E482FC2EE904AF78A072B177A77B6A347E11E7';
        this.Basic_Auth = 'WGR5b3k5T2wybjNRWGthbjo2YjZLbnV2XkpJT3dNaCxdP2Q6VkB1Vz9MNntibCxtXw==';
        this.X_Api_Version = 2;
        this.My_Recipient_Token = "3A0EEA171E5168286DE02A7FB8E482FC2EE904AF78A072B177A77B6A347E11E7";
    }

    async oauthToken() {
        const config = {
            headers: {
                'Authorization': `Basic ${this.Basic_Auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        return await axios.post(`${this.url_base_pay}/authorization-server/oauth/token`, 'grant_type=client_credentials', config)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error.response.data.details;
        })
    }

    async criarCobrancaComSplit(dadosCobranca:Charge) {

        let recipientToken_more = this.My_Recipient_Token;
        let porcentagem_more = 10;
        let porcentagem_destino = 90;

        var postData = {
            charge: {
                description: dadosCobranca.descricao,
                amount: dadosCobranca.valor_cobranca,
                paymentTypes: dadosCobranca.tipo_pagamento,
                split: [
                    {
                        recipientToken: recipientToken_more,
                        percentage: porcentagem_more,
                        amountRemainder: false,
                        chargeFee: true // se for true, indica que este pagará taxa da Juno
                    },
                    {
                        recipientToken: dadosCobranca.recipient_token_destino,
                        percentage: porcentagem_destino,
                        amountRemainder: true,// se for true, indica que recebe o 'restante' do valor total
                        chargeFee: false
                    }
                ]
            },
            billing: {
                name: dadosCobranca.nome_comprador,
                document: dadosCobranca.documento_comprador
            }
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${this.Access_Token}`,
                'X-Api-Version': this.X_Api_Version,
                'X-Resource-Token': this.X_Resource_Token_More,
                'Content-Type': `application/json;charset=UTF-8`,
            }
        }
        return await axios.post(`${this.url_base_pay}/api-integration/charges`, postData, config)
        .then((res) => {
            return res.data._embedded.charges
        })
        .catch((error) => {
            return error.response.data.details
        })
    }

    async tokenizarCartao(creditCardHash:string) {
        var postData = {creditCardHash};
        const config = {
            headers: {
                'Authorization': `Bearer ${this.Access_Token}`,
                'X-Api-Version': this.X_Api_Version,
                'X-Resource-Token': this.X_Resource_Token_More,
                'Content-Type': `application/json;charset=UTF-8`,
            }
        }
        return await axios.post(`${this.url_base_pay}/api-integration/credit-cards/tokenization`, postData, config)
        .then((res) => {
            return res
        })
        .catch((error) => {
            return error.response.data.details
        })
    }

    async criarPagamentoDeCobranca(chargeId:string, address:Address, creditCardId:string, email:string) {
        var postData = {
            chargeId,
            billing:{
                email,
                address:address,
                delayed:true// se true, o valor fica retido até a captura do pagamento
            },
            creditCardDetails: {creditCardId}
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${this.Access_Token}`,
                'X-Api-Version': this.X_Api_Version,
                'X-Resource-Token': this.X_Resource_Token_More,
                'Content-Type': `application/json;charset=UTF-8`,
            }
        }
        return await axios.post(`${this.url_base_pay}/api-integration/payments`, postData, config)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error.response.data.details
        })
    }

    async capturarPagamento(chargeId:string, paymentId:string) {
        var postData = {chargeId};
        const config = {
            headers: {
                'Authorization': `Bearer ${this.Access_Token}`,
                'X-Api-Version': this.X_Api_Version,
                'X-Resource-Token': this.X_Resource_Token_More,
                'Content-Type': `application/json;charset=UTF-8`,
            }
        }
        return await axios.post(`${this.url_base_pay}/api-integration/payments/${paymentId}/capture`, postData, config)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error.response.data.details
        })
    }

    async saldo() {
        const config = {
            headers: {
                'Authorization': `Bearer ${this.Access_Token}`,
                'X-Api-Version': this.X_Api_Version,
                'X-Resource-Token': this.X_Resource_Token_More,
                'Content-Type': `application/json;charset=UTF-8`,
            }
        }
        return await axios.get(`${this.url_base_pay}/api-integration/balance`, config)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error.response.data.details
        })
    }
}