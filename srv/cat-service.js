const cds = require('@sap/cds');

module.exports = class CNPJCheck extends cds.ApplicationService {
    init() {
        this.before("CREATE", "Coleta", (req) => {
            console.log(req.data);

            if (!cnpj_fornecedor) {
                return req.error(400, "CNPJ do fornecedor é obrigatório.")
            }

            if (!validarCNPJ(cnpj_fornecedor)) {
                return req.error(400, "CNPJ Inválido.")
            }
        })

        return super.init();
    }
}