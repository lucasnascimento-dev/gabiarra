import cds from "@sap/cds";
import { results } from "@sap/cds/lib/utils/cds-utils.js";
// import validarCNPJ from "./validation_functions";

async function validarCNPJ(cnpj) {
    // console.log("entrei na função validar")
    // try {
    //     console.log(`cnpj: ${cnpj}`)
    //     const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);     
    //     console.log(`response.status: ${response.status}`)   
        
    //     // Se nãofor ok, lê como texto e lança erro
    //     if (response.ok) {
    //         const erro = await response.text();
    //         throw new Error(erro);
    //     };

    //     // Se status 200, lê JSON e retorna true
    //     const data = await response.json();
        return true;

    // } catch (error) {
    //     throw new Error(`Falha na validação: ${error.message}`);
    // }
};

const validStatusCriacao = ['Criada', 'Encaminhada', 'Aceita', 'Rejeitada', 'Coletada'];

class MyServices extends cds.ApplicationService {
    init() {
        const { Coletas, Pedidos, Acompanhamentos } = this.entities

        // Validação de CNPJ e status e status de coleta ao criar
        this.before("POST", Coletas, async (req) => {
            const cnpj = req.data["cnpj_fornecedor"];

            if (!/^\d+$/.test(cnpj) && cnpj.length == 14) {
                return req.error(400, "CNPJ deve conter exatamente 14 dígitos e ser composto apenas por números")
            };

            try {
                const cnpjValido = await validarCNPJ(cnpj)
                // console.log(`cnpjValido: ${cnpjValido}`)
                if (!cnpjValido) {
                    return req.error(400, "CNPJ inválido ou não encontrado");
                };
            } catch (error) {
                return req.error(400, error.message);
            };

            // Usar o stringfy ou o JS usa o toString()
            const pedidos = req.data.pedidos;
            // console.log(`req: ${JSON.stringify(req)}`)
            // console.log(`req.data: ${JSON.stringify(req.data)}`)
            // console.log(`req.data.pedidos: ${JSON.stringify(req.data.pedidos)}`)
            // console.log(`pedidosId: ${pedidos}`)
            if (pedidos) {
                const pedidosId = pedidos.map(pedido => pedido.ID) // Captura apenas os IDs dos pedidos
                // console.log(`IDs dos pedidos: ${JSON.stringify(pedidosId)}`)
                const coletaExistente = await cds.run(
                    SELECT.one.from(Coletas).alias('c') // Busca uma coleta
                        .join(Acompanhamentos).alias('a').on('a.coleta_ID = c.ID') // Adicoina os acompanhamentos da coleta
                        .join(Status).alias('s').on('a.status_status = s.status') // Adiciona Status do acompanhamento
                        .where('s.status in', validStatusCriacao) 
                        .and('c_cnpj_fornecedor =', cnpj) // Filtra pelo mesmo fornecedor da coleta atual
                        .and(`EXISTS (SELECT 1 FROM vendas.pedidos p WHERE p.coleta_ID = c.ID AND p.ID in`, pedidosId, ')') // Só retorna se tiver pedidos associados a coleta
                );
                console.log(`coletaExistente: ${coletaExistente}`)
                if (coletaExistente) {
                    return req.error(400, 'já existe uma coleta vinculada a este pedido')
                }
            }
            // persistir os dados com cds.create

        })

        return super.init();
    }
};

export default MyServices;
