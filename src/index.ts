import Payment from './payment';

const payment = new Payment();

/*
const auth = payment.auth();
auth.then((res) => {
    console.log(res);
})
.catch((error) => {
    console.error(error);
});
*/


const saldo = payment.saldo();
saldo.then((res) => {
    console.log(res);
})
.catch((error) => {
    console.error(error);
});


/*
var capturar = true;

if (capturar) {
    var chargeId = 'chr_BB4525F9131AD8662A63BF699C06D449';
    var payments_id = 'pay_13A171B639DFC734';
    const cobranca = payment.capturarPagamento(chargeId, payments_id);
    cobranca.then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });
} else {
    var 
        cardHash = 'f174ca71-7d18-4efa-bcd0-8518209a12ac',// hash gerado na biblioteca web de criptografia da Juno
        dadosCobranca = {
            descricao: 'teste 1',
            valor_cobranca: 120.70,
            recipient_token_destino: '397F1B7B722DE52E88D68D8D3E16C5A45A376016E099F5093D79D83629DE8135',// destino do pagamento, prestador do serviço, quem vai receber o valor
            nome_comprador: 'ronaldo freitas da cunha',// nome da pessoa ou empresa
            documento_comprador: '91265426090',// CPF ou CNPJ
            tipo_pagamento: ['CREDIT_CARD']// ["CREDIT_CARD"], ["CREDIT_CARD", "BOLETO"] ou ["BOLETO"]
        },
        endereco = {
            street: "rua monte castelo",
            number: "1",
            city: "Salvador",
            state: "BA",
            postCode: "40301210",
        },
        email = 'ronafreitasweb@gmail.com';

    const cobranca = payment.cobranca(dadosCobranca, cardHash, endereco, email);
    cobranca.then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });
}
*/
