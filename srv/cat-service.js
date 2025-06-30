import cds from "@sap/cds";
import { results } from "@sap/cds/lib/utils/cds-utils";
// import validarCNPJ from "./validation_functions";

async function validarCNPJ(cnpj) {
    console.log("entrei na função validar")
    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        const data = await response.json();
        console.log(data);


        if (!response.ok) {
            throw new Error(data.message || `Erro na API: ${response.status}`);
        };
        return true;

    } catch (error) {
        throw new Error(`Falha na validação: ${error.message}`);
    }
};

const validStatusCriacao = ['Criada', 'Encaminhada', 'Aceita', 'Rejeitada', 'Coletada'];

class MyServices extends cds.ApplicationService {
    init() {
        const { Coletas, Pedidoa, Acompanhamentos } = this.entities

        // Validação de CNPJ e status e status de coleta ao criar
        this.before("POST", Coletas, async (req) => {
            const cnpj = req.data["cnpj_fornecedor"];

            if (!/^\d+$/.test(cnpj) && cnpj.length == 14) {
                return req.error(400, "CNPJ deve conter exatamente 14 dígitos e ser composto apenas por números")
            };

            try {
                const cnpjValido = await validarCNPJ(cnpj)
                if (!cnpjValido) {
                    return req.error(400, "CNPJ inválido ou não encontrado");
                };
            } catch (error) {
                return req.error(400, error.message);
            };

            const pedidos = req.data.pedidos;
            if (pedidos) {
                const pedidosId = pedidos.map((pedidos) => pedidos.ID) // Captura apenas os IDs dos pedidos

                const coletaExistente = await cds.run(
                    SELECT.one.from(Coletas).alias('c') // Busca uma coleta
                        .join(Acompanhamentos).alias('a').on('a.coleta_ID = c.ID') // Adicoina os acompanhamentos da coleta
                        .join(Status).alias('s').on('a.status_status = s.status') // Adiciona Status do acompanhamento
                        .where('s.status in', validStatusCriacao)
                        .and(`EXISTS (SELECT 1 FROM vendas.pedidos p WHERE p.coleta_ID = c.ID AND p.ID in`, pedidosId, ')') // Só retorna se tiver pedidos associados a coleta
                )

            }

        })

        return super.init();
    }
};

export default MyServices;
