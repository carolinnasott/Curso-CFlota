<?php
include_once "model/movil-bitacora.php";

$app->get('/movil-bitacora', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_VER");

    $db = SQL::connect();
    $model = new MovilBitacora();

    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });

$app->delete('/movil-bitacora/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQL::connect();
    $model = new MovilBitacora();

    $results = $model->delete($db, $id);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });

$app->post('/movil-bitacora', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $db = SQL::connect();
    $model = new MovilBitacora();

    $results = $model->post($db);

    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});

$app->put('/movil-bitacora', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $db = SQL::connect();
    $model = new MovilBitacora();

    $results = $model->put($db);

    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});
?>