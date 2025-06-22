const cds = require('@sap/cds');
const { message } = require('@sap/cds/lib/log/cds-error');

module.exports = class CNPJCheck extends cds.ApplicationService {
    init() {
        this.on("teste", (req) => {
            console.log("Conteúdo req: ", req.data)
            return {
                message: "req no console",
                receiveData: req.data
            }
        })

        return super.init();
    }
}