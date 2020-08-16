import Juno from './juno';

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

export default class Payment {

    pay: any;

    constructor() {
        this.pay = new Juno();
    }

    async auth() {
        try {
            let auth = this.pay.oauthToken();
            return await auth
            .then(async (res:any) => {
                return res.access_token;
            })
            .catch((err:any) => {
                return err
            });
        } catch (error) {
            console.error(error);
            throw new Error("Não foi possível autorizar");            
        }
    }

  	/**
	 * Método que cria cobrança.
	 * ...
	 * 
	 * @return Object {chargeId, payment_id}
	*/
    async cobranca(dadosCobranca:Charge, hashCreditCard:string, endereco:Address, email:string) {
        try {
            let tokenizarCartao = this.pay.tokenizarCartao(hashCreditCard);
            return await tokenizarCartao.then(async (resT:any) => {
                var creditCardId = resT.data.creditCardId;
                console.log('hash do cartão tokenizado')

                let criarCobrancaComSplit = this.pay.criarCobrancaComSplit(dadosCobranca);
                return await criarCobrancaComSplit.then(async (resC:any) => {
                    var chargeId = resC[0].id;
                    console.log('cobrança criada')

                    let criarPagamentoDeCobranca = this.pay.criarPagamentoDeCobranca(chargeId, endereco, creditCardId, email);
                    return await criarPagamentoDeCobranca.then((resP:any) => {
                        console.log('pagamento de cobrança split realizada')
                        return {
                            chargeId,
                            payments_id: resP.payments[0].id
                        };
                    })
                    .catch((erP:any) => {
                        return erP
                    });
                })
                .catch((erC:any) => {
                    return erC
                });
            })
            .catch((erT:any) => {
                return erT
            });
        } catch (error) {
            console.error(error);
            throw new Error("Não foi possível realizar a cobrança");            
        }
    }


  	/**
	 * Método que captura ('repassa') o valor retido para o prestador do serviço
	 * ...
	 * 
	 * @return Object {chargeId, payment_id}
	*/
    async capturarPagamento(chargeId:string, payments_id:string) {
        try {
            let capturarPagamento = this.pay.capturarPagamento(chargeId, payments_id);
            return await capturarPagamento
            .then(async (resCp:any) => {
                return resCp;
            })
            .catch((erCp:any) => {
                return erCp
            });
        } catch (error) {
            console.error(error);
            throw new Error("Não foi possível capturar pagamento");            
        }
    }

    async saldo() {
        try {
            let saldo = this.pay.saldo();
            return await saldo
            .then(async (res:any) => {
                return res;
            })
            .catch((err:any) => {
                return err
            });
        } catch (error) {
            console.error(error);
            throw new Error("Não foi possível verificar o saldo");            
        }
    }
}
