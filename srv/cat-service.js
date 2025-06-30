import cds from '@sap/cds';
import { validarCNPJ } from './validation_functions.js'; 


const validStatusCriacao = ['Criada', 'Encaminhada', 'Aceita', 'Rejeitada', 'Coletada'];

class MyServices extends cds.ApplicationService {
    init() {
        const { Coletas, Pedidos, Acompanhamentos, Status } = this.entities
        console.log("Entidades disponíveis:", Object.keys(this.entities));

        // Validação de CNPJ e status e status de coleta ao criar
        this.before("POST", Coletas, async (req) => {
            const cnpj = req.data["cnpj_fornecedor"];
            
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
                console.log('pedidosID definido')
                const coletaExistente = await cds.run(
                    SELECT.from(Coletas).alias('c') // Busca uma coleta
                        .join(Acompanhamentos).as('a').on('a.coleta = c.ID') // Adicoina os acompanhamentos da coleta
                        .join(Status).as('s').on('a.status = s.status') // Adiciona Status do acompanhamento
                        .where({
                            's.status': { in: validStatusCriacao },
                            'c.cnpj_fornecedor': cnpj
                        }) // Filtra pelo mesmo fornecedor da coleta atual                        
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
