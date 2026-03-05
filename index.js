const express = require('express')
const app = express()
// necessário para permitir requisições de diferentes origens(dominios/servidores)
const cors = require('cors')
app.use(cors())

/* Indica que todas as requisições podem receber Body em JSON. A partir disso, o Express aplica um JSON.parse para o conteudo recebido */

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send("locadora-rent-car")
})

let mysql = require('mysql')
let conexao = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "locadora_db"
})

conexao.connect(function (erro) {
    if (erro) {
        console.log("Deu ruim na conexao \n")
        throw erro;
    } else {
        console.log("Conexão deu bom \n")
    }
})

// Rota para salvar a reserva
app.post('/reservar', (req, res) => {
    const { nome, email, categoria } = req.body;
    
    const query = 'INSERT INTO reservas (nome, email, categoria) VALUES (?, ?, ?)';
    
   conexao.query(query, [nome, email, categoria], (err, result) => {
        if (err) {
            console.error('Erro ao salvar:', err);
            return res.status(500).send('Erro no servidor');
        }
        res.send('Reserva realizada com sucesso!');
    });
});

// ROTA: Cadastrar Veículo
app.post('/veiculos', (req, res) => {
    const { modelo, marca, placa, categoria } = req.body;
    const query = 'INSERT INTO veiculos (modelo, marca, placa, categoria) VALUES (?, ?, ?, ?)';
    
    conexao.query(query, [modelo, marca, placa, categoria], (err, result) => {
        if (err) return res.status(500).send('Erro ao cadastrar veículo: ' + err.message);
        res.send('Veículo cadastrado com sucesso!');
    });
});

// ROTA: Listar Veículos
app.get('/veiculos', (req, res) => {
    const query = 'SELECT * FROM veiculos';
    
    conexao.query(query, (err, results) => {
        if (err) return res.status(500).send('Erro ao listar veículos');
        res.json(results); // Retorna a lista de carros em formato JSON
    });
});

// ROTA: Cancelar/Excluir Reserva
app.delete('/reservar/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM reservas WHERE id = ?';
    
    conexao.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir reserva:', err);
            return res.status(500).send('Erro ao tentar cancelar a reserva.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Reserva não encontrada.');
        }

        res.send('Reserva cancelada com sucesso!');
    });
});
app.post("/login/", function (req, res){
    const usuario = req.body.usuario
    const senha = req.body.senha
    conexao.query(`select * from usuarios where usuario = '${usuario}' and senha = '${senha}'`, function (erro, resultado, campos){
        if (erro){
            res.send(erro)
        }else{
            if (resultado.length > 0){
                res.sendStatus(200)
            }else{
                res.sendStatus(401)
            }
        }
    })
})
app.get('/reservar_lista', (req, res) => {
    const query = 'SELECT * FROM reservas';
    conexao.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));