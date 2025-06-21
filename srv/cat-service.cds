using { vendas } from '../db/schema';

service MyService {
    entity Coletas as projection on vendas.Coletas;
    entity Pedidos as projection on vendas.Pedidos;
    entity Acompanhamentos as projection on vendas.Acompanhamentos;
    entity Status as projection on vendas.Status;
}