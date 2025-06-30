import cds from '@sap/cds';
import { validarCNPJ } from './validation_functions.js'; 


const validStatusCriacao = ['Criada', 'Encaminhada', 'Aceita', 'Rejeitada', 'Coletada'];

class MyServices extends cds.ApplicationService {
    init() {
        const { Coletas, Pedidos, Acompanhamentos, Status } = this.entities

        // Validação de CNPJ e status e status de coleta ao criar
        this.before("POST", Coletas, async (req) => {
            const cnpj = req.data["cnpj_fornecedor"];

            try {
                await validarCNPJ(cnpj)
            } catch (error) {
                return req.error(400, error.message);
            };

            const pedidos = req.data.pedidos;

            if (pedidos) {
                const pedidosId = pedidos.map(pedido => pedido.ID) // Captura apenas os IDs dos pedidos
                console.log("Entidades disponíveis:", Object.keys(this.entities));
                console.log(`pedidosID definido ${JSON.stringify(pedidosId)}`)
                const coletaExistente = await cds.run(
                    SELECT.from(Coletas).alias('c') // Busca uma coleta
                        .join(Acompanhamentos).alias('a').on('a.coleta = c.ID') // Adicoina os acompanhamentos da coleta
                        .join(Status).alias('s').on('a.status = s.status') // Adiciona Status do acompanhamento
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
