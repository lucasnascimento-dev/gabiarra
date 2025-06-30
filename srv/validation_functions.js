import cds from "@sap/cds";

export async function validarCNPJ(cnpj) {

    if (!/^\d+$/.test(cnpj)) {
        throw new Error("CNPJ deve conter exatamente 14 dígitos e ser composto apenas por números");
    };

    try {
        console.log("teste")
        const brasilapi = await cds.connect.to("BrasilAPI_CNPJ");
        const result = await brasilapi.get(`/cnpj/v1/${cnpj}`);
        console.log(`result: ${result}`)
        return true;
    } catch (error) {
        console.error(error.message);
        throw new Error("CNPJ inválido ou não encontrado");

    }
};
