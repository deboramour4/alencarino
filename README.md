Para alterar o texto de um bloco editar->
-maze/tamplate.soy
-para editar as variaveis de mensagem to template.

para mudar a cor do bloco é em ->
-maze/js/blocks.js
-Maze.Blocks.MOVEMENT_HUE = 20;

alterar saturation e values dos blocos->
-third-party/blockly/core/constants.js
-alterar Blockly.HSV_SATURATION e Blockly.HSV_VALUE

propriedades possiveis em novos blocos->
-https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
-os projetos ja vem uma area que vc pode criar os blocos novos e ele dá o codigo https://blockly-demo.appspot.com/static/demos/blockfactory/index.html

criar um novo bloco funcional->
-adicionar a definicao do bloco em maze/js/blocks.js
-adicionar o bloco no template.soy para aparecer na fase desejada
-tem que ser adicionado na toolbox (que esta no template.soy) dessa forma https://developers.google.com/blockly/guides/configure/web/toolbox

todo o layout da pagina maze.html é setado->
-maze/template.soy
-toolbox, live view, informacoes na tela, skins, dialogs (help)

workspace do blockly é definido em->
-maze/js/maze.js - linha 511
-são definidos se tem lixeira ou não.. coisas assim.
-ali é setado zoom do workspace

onde seta o valor do top, left e width do workspace->
-maze/js/maze.js - linha 495
-na vdd a altura e largura da lieview depende da  quantidade de linhas e colunas da matriz que sera desenhada - linha 241

largura e altura da live view definida em->
-maze/template.soy - linha 82
-era, mas eu tirei. agora é programaticamente

botao de recomeçar/start ->
- está em uma table e é criado em maze/template.soy - linha 95
- pode ser alterado pra ser outra coisa (fiz iso)

para mudar a cor do background do toolbox ->
- third-party/blockly/core/css.js:
- 483    '.blocklyFlyoutBackground {',
  484:     'fill: #ddd;'
- ou modificar no maze/style.css adicionando a classe .blocklyFlyoutBackground

para mudar a fonte do bloco ->
- modificar no maze/style.css adicionando a classe .blocklyText

alterar padding dos blocos ->
-a forma mais fácil de alterar a margem do texto para a borda do bloco é balanceando o tamanho da fonte e o zoom do workspace. Dá pra fazer coisas mais complexas, mas ai teria que mexer no svg do bloco.

para mudar a cor de "highlighted" (aquele amarelo) ->
-mofificar no maze/style.css adicionando o codigo
-.blocklyHighlightedConnectionPath {
  	fill: none;
  	stroke: #f00;
  	stroke-width: 4px;
}
.blocklySelected>.blocklyPath {
	stroke: #f00;
	stroke-width: 3px;
}

.blocklySelected>.blocklyCommentTarget {
	stroke: #f00;
	stroke-width: 3px;
}

.blocklyDeleteIconShape.blocklyDeleteIconHighlighted {
	stroke: #f00;
}


site com unicode de emojis ->
https://www.charbase.com/block/miscellaneous-symbols-and-pictographs


NOVO-------
encontrar um jeito de divir esse arquivo em vários arquivos e só importar ele.. pq esse dai é enorme.

onde está o core das funcoes moveForward, turnLeft, turnRight ->
- estão no arquivo maze/js/maze.js pela linha 1472.
- lá ele diz o que cada função vai fazer

a funcao é injetada no interpretador do js ->
- no arquivo maze/js/maze.js pela linha 1022. é uma função pequena que faz isso

execução do código gerado pelo usuário ->
- No arquivo maze/js/maze.js pela linha 1089.
- Pega os blocos que estão no blockly e transforma em código


existem varios estados para o resultado =
	// Maze.ResultType.UNSET = indefinido:
	// Maze.ResultType.SUCCESS = solucionou o labirinto
	// Maze.ResultType.TIMEOUT = quando o programa roda sem fim
	// Maze.ResultType.ERROR = se qualquer erro acontecer
	// Maze.ResultType.FAILURE = se o programa terminar, mas não resolver o labirinto