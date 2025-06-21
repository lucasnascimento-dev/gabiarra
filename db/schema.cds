using {cuid} from '@sap/cds/common';
using {managed} from '@sap/cds/common';

namespace vendas;

entity Coletas : cuid, managed {
    key cnpj_fornecedor : String(14);
        transportadora  : String(100);
        pedidos         : Composition of many Pedidos
                              on pedidos.
    }


