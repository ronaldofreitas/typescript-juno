"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const juno_1 = require("./juno");
class Payment {
    constructor() {
        this.pay = new juno_1.default();
    }
    async auth() {
        try {
            let auth = this.pay.oauthToken();
            return await auth
                .then(async (res) => {
                return res.access_token;
            })
                .catch((err) => {
                return err;
            });
        }
        catch (error) {
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
    async cobranca(dadosCobranca, hashCreditCard, endereco, email) {
        try {
            let tokenizarCartao = this.pay.tokenizarCartao(hashCreditCard);
            return await tokenizarCartao.then(async (resT) => {
                var creditCardId = resT.data.creditCardId;
                console.log('hash do cartão tokenizado');
                let criarCobrancaComSplit = this.pay.criarCobrancaComSplit(dadosCobranca);
                return await criarCobrancaComSplit.then(async (resC) => {
                    var chargeId = resC[0].id;
                    console.log('cobrança criada');
                    let criarPagamentoDeCobranca = this.pay.criarPagamentoDeCobranca(chargeId, endereco, creditCardId, email);
                    return await criarPagamentoDeCobranca.then((resP) => {
                        console.log('pagamento de cobrança split realizada');
                        return {
                            chargeId,
                            payments_id: resP.payments[0].id
                        };
                    })
                        .catch((erP) => {
                        return erP;
                    });
                })
                    .catch((erC) => {
                    return erC;
                });
            })
                .catch((erT) => {
                return erT;
            });
        }
        catch (error) {
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
    async capturarPagamento(chargeId, payments_id) {
        try {
            let capturarPagamento = this.pay.capturarPagamento(chargeId, payments_id);
            return await capturarPagamento
                .then(async (resCp) => {
                return resCp;
            })
                .catch((erCp) => {
                return erCp;
            });
        }
        catch (error) {
            console.error(error);
            throw new Error("Não foi possível capturar pagamento");
        }
    }
    async saldo() {
        try {
            let saldo = this.pay.saldo();
            return await saldo
                .then(async (res) => {
                return res;
            })
                .catch((err) => {
                return err;
            });
        }
        catch (error) {
            console.error(error);
            throw new Error("Não foi possível verificar o saldo");
        }
    }
}
exports.default = Payment;
//# sourceMappingURL=payment.js.map