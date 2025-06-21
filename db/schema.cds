using {cuid} from '@sap/cds/common';
using {managed} from '@sap/cds/common';

namespace vendas;

entity Coletas : cuid, managed {
    key cnpj_fornecedor : String(14);
        transportadora  : String(100);
        pedidos         : Composition of many Pedidos
                              on pedidos.
    }

entity Pedidos : cuid {
        numero_pedido : String(225);
        item_pedido   : String(225);
        valor_pedido  : Decimal(12, 2);

        coleta : Association to Coletas;
}

entity Acompanhamentos : cuid {
    data_comentario : DateTime;
    
    status : Association to Status;
    coleta : Association to Coletas;
}