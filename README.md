# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.

### Modelagem de dados
O projeto possui uma modelagem de dados que representa o processo de gestão de coletas, pedidos e seus acompanhamentos.

### Estrutura dos relacionamentos
- Uma coleta pode ter vários pedidos
- Uma coleta pode ter muitos acompanhamentos
- Cada acompanhamento possui um status 

### Validação de CNPJ com a API do BrasilAPI
Foi implementada uma regra de validação no backend que verifica a existência do CNPJ do fornecedor antes de criar uma coleta.

- No evento "before CREATE" da entidade Coletas, é executada uma chamada para a API BrasilAPI;
- A função asíncrona criada garante que O CNPJ informado seja válido;
    - Para CNPJ inexistente ou inválido a Coleta não é criada e um erro é lançado;
    - Caso o CNPJ não seja informado é lançado uma mensagem informando que o CNPJ é obrigatório;
    - Caso seja passado algo além de números uma mensagem é lançado um erro informando que o campo só aceita números.