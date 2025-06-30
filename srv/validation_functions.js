export async function validarCNPJ(cnpj) {
    console.log("entrei na função validar")
    try {
        console.log(`cnpj: ${cnpj}`)
        if (!/^\d+$/.test(cnpj) && cnpj.length == 14) {
            return req.error(400, "CNPJ deve conter exatamente 14 dígitos e ser composto apenas por números")
        };
        
        const api = {
            url: `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
            format: 'json',
            kind: 'rest'
        }
        const response = await cds.import.from.asyncapi(api);     
        console.log(`response.status: ${response.status}`)   

        // Se nãofor ok, lê como texto e lança erro
        if (response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        };

        // Se status 200, lê JSON e retorna true
        const data = await response.json();
    return true;

    } catch (error) {
        throw new Error(`Falha na validação: ${error.message}`);
    }
};
