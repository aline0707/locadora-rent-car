function fnLimparCampos() {
    document.getElementById("form-login").reset()
}

function fnFazerLogin() {
    let formDados = {
        usuario: document.getElementById("usuario").value,
        senha: document.getElementById("senha").value
    }
    
    fetch('http://localhost:3000/login/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formDados)
    })
    // CORREÇÃO AQUI: removido os parênteses de .status()
    .then(resposta => resposta.status) 
    .then((dados) => {
        fnLimparCampos()
        if (dados === 200) {
            console.log("acesso a pagina ADMIN")
            // DICA: Você pode redirecionar o usuário aqui
            // window.location.href = "admin.html";
        } else if (dados === 401) {
            alert("Usuário ou senha inválidos")
            console.log("Usuário ou senha inválidos")
        } else {
            console.log("Algum erro aconteceu, tente novamente mais tarde")
        }
    })
    .catch(erro => console.log("Erro na requisição: " + erro.message))
}

let btn_login = document.getElementById("btn-login")
btn_login.addEventListener("click", function () {
    console.log("oi")
    fnFazerLogin()
})