O bot usa a biblioteca whatsapp-web.js 
A ideia é que todas as funções relacionadas a interação com o banco sejam criadas nas repositories. O banco de dados é sqlite e está na pasta 'database' junto da função de conexão. 
Para uma melhor organização recomendo que os novos comandos sejam 
  1. Criados nos respectivos handlers na pasta de mesmo nome.
  2. Sejam adicionados no array 'comandosValidos' porque esse array é responsável por validar as mensagens.
  3. Um case do comando seja adicionado no motor, pois ele que direciona a mensagem à devida função.

O que precisa fazer? 
  - Integrar o bot a Web API do Spotify¹
  - Refatorar o resto dos comandos (disponíveis no arquivo comentado 'mainHandler.js')
  - Verificar o relacionamento entre as tabelas.
  - Adicionar novos comandos que façam sentido com a ideia do bot
  - Popular a tabela "gêneros"²

<h5>Comandos já adicionados</h5>
<ul>
  <li>!help: É uma lista dos comandos disponíveis até o momento.</li>
  <li>!add <Tag>: Permite o cadastro do usuário em um tag.</li>
  <li>!remove <Tag>: Permite a remoção do usuário de um tag.</li>
  <li>@@<Tag>: Faz o bot marcar a lista de usuários cadastrados na tag.</li>
  <li>!minhasmarcacoes: Exibe uma lista de tags que o usuário está cadastrado.</li>
  <li>!consultaTags: Exibe uma lista das tags disponíveis.</li>
</ul>


<h5>Comandos a adicionar</h5>
<ul>
  <li>!addPlaylist <nome>: Permite que o usuário adicione uma playlist no spotify.</li>
  <li>!removePlaylist <nome>: Permite que o usuário dono da playlist a remova.</li>
  <li>!inserir <URL> <Playlist>: Permite que o usuário insira músicas na playlist</li>
  <li>!consultaPlaylists: Exibe uma lista das playlists criadas.</li>
  <li>!website: Envia o link do website do bot³</li>
  <li>!sugestao: Envia uma música aleatória já adicionada nas playlists.</li>
  <li>!match: Envia o usuário do grupo com mais proximidade em gosto musical.</li>
  <li>Todo dia o bot pode enviar uma música aleatória como recomendação.</li>
</ul>

¹Web API do Spotify: A ideia dessa integração é permitir que os usuários adicionem músicas e playlists públicas em um perfil próprio do bot, para permitir o armazenamento das músicas enviadas no grupo.
A Web API permite a criação de playlists e adição de músicas. 

²Tabela de gêneros musicais: Decidir se a tabela de gêneros vai armazenar todos os gêneros do spotify e não permitir a adição de novos ou se ela vai começar vazia e os usuários irão adicioná-los com o tempo.

³Website: A ideia é que futuramente o bot tenha seu próprio site, informando a lista de playlists e algumas estatísticas do grupo. Funcionando também como uma web radio das músicas já adicionadas.
