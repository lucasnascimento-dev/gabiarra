import cds from "@sap/cds";
// import { MyService } from "../db";
// import { validarCNPJ } from "./validation_functions";

class MyServices extends cds.ApplicationService {
    init() {
        const { Coletas, Pedidoa, Acompanhamentos } = this.entities

        this.before("READ", Coletas, async (req) => {
            console.log('TESTE1');
            
            //se existir . ou - gerar info pedindo apenas números

            // if (!cnpj_fornecedor) {
            //     return req.error(400, "CNPJ do fornecedor é obrigatório.")
            // }

            // const cnpjValido = await validarCNPJ(cnpj_fornecedor)

            // if (!cnpjValido) {
            //     return req.error(400, "CNPJ Inválido.")
            // }
        })
        this.on("READ", Coletas, async (data, req) => {
            console.log(`TESTE2`);
        })       
        this.after("READ", Coletas, async (data, req) => {
            console.log(`TESTE3`);
        })

        return super.init();
    }
};

export default MyServices;
