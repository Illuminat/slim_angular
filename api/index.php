<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require __DIR__ . '/../vendor/autoload.php';
$config = require __DIR__ . '/configs/global.php';

$app = new \Slim\App(["settings" => $config]);

$container = $app->getContainer();

$container['db'] = function ($setting) {
    $db = $setting['settings']['db'];
    $pdo = new PDO($db['dns'], $db['username'], $db['password']);
    $pdo->setAttribute( PDO::ATTR_PERSISTENT, TRUE );
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    return $pdo;
};

$app->get('/tasks', function (Request $request, Response $response, $args) {
    try {
        $sth = $this->db->prepare("SELECT * FROM tasks ORDER BY id DESC");
        $sth->execute();
        $todos = $sth->fetchAll();
    } catch (PDOException $e ) {
        die( 'Connection failed: ' . $e->getMessage() );
    }
    return $this->response->withJson($todos);
});

$app->get('/task/{id}', function (Request $request, Response $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM tasks WHERE id=:id");
    $sth->bindParam("id", $args['id'], PDO::PARAM_STR);
    $sth->execute();
    $task = $sth->fetchObject();
    return $this->response->withJson($task);
});


$app->post('/task/new', function (Request $request, Response $response) {
    try {
        $input = $request->getParsedBody();
        $sql = "INSERT INTO tasks (title, type) VALUES (:title, :type)";
        $sth = $this->db->prepare($sql);
        $sth->bindParam("title", $input['title'], PDO::PARAM_STR);
        $sth->bindParam("type", $input['type'], PDO::PARAM_STR);
        $sth->execute();

    } catch (PDOException $e ) {
        die( 'Connection failed: ' . $e->getMessage() );
    }
    return $this->response;
});

$app->delete('/task/{id}', function (Request $request, Response $response, $args) {
    $sth = $this->db->prepare("DELETE FROM tasks WHERE id=:id");
    $sth->bindParam("id", $args['id'], PDO::PARAM_INT);
    $sth->execute();
    return $this->response;
});

$app->put('/task/[{id}]', function (Request $request, Response $response, $args) {
    $input = $request->getParsedBody();
    $sql = "UPDATE tasks SET title=:title, type=:type WHERE id=:id";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("id",    $args['id'], PDO::PARAM_INT);
    $sth->bindParam("title", $input['title'], PDO::PARAM_STR);
    $sth->bindParam("type",  $input['type'], PDO::PARAM_STR);
    $sth->execute();
    return $this->response;
});

// Run application
$app->run();

?>


