
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
