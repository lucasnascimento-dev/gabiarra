// export async function validarCNPJ(cnpj) {
//     console.log("entrei na função validar")
//     try {
//         const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
//         const data = await response.json();
//         console.log(data)


//         if (!response.ok) {
//             throw new Error(data.message || `Erro na API: ${response.status}`);
            
//         }
//         return true;

//     } catch (error) {
//         throw new Error(`Falha na validação: ${error.message}`);
//     }
// };
