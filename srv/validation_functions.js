import cds from "@sap/cds";

export async function validarCNPJ(cnpj) {

    if (!/^\d+$/.test(cnpj) && cnpj.length == 14) {
        return req.error(400, "CNPJ deve conter exatamente 14 dígitos e ser composto apenas por números")
    };

    try {
        const brasilapi = await cds.connect.to("BrasilAPI_CNPJ");
        const result = await brasilapi.get(`/cnpj/v1/${cnpj}`);
        return true;
    } catch (error) {
        console.error(error.message);
        throw new Error("CNPJ inválido ou não encontrado");

    }
};
