const cds = require('@sap/cds');
const axios = require('axios')

async function validarCNPJ(cnpj_fornecedor) {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj_fornecedor}`);
        if (response.cnpj) {
            return true;
        }
    } catch (error) {
        if (!error.data) {
            throw new Error("Erro ao consultar API");
        } else {
            return error.message
        };
    }
}

module.exports = class CNPJCheck extends cds.ApplicationService {
    init() {
        this.before("CREATE", "Coleta", async (req) => {
            console.log(req.data);

            //se existir . ou - gerar info pedindo apenas números

            if (!cnpj_fornecedor) {
                return req.error(400, "CNPJ do fornecedor é obrigatório.")
            }

            const cnpjValido = await validarCNPJ(cnpj_fornecedor)

            if (!cnpjValido) {
                return req.error(400, "CNPJ Inválido.")
            }
        })

        return super.init();
    }
};
