<?php
include_once "model/movil-odometro.php";

$app->get('/movil-odometro', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_VER");

    $db = SQL::connect();
    $model = new MovilOdometro();

    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });

$app->delete('/movil-odometro/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQL::connect();
    $model = new MovilOdometro();

    $results = $model->delete($db, $id);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });

$app->post('/movil-odometro', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $db = SQL::connect();
    $model = new MovilOdometro();

    $results = $model->post($db);

    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});

$app->put('/movil-odometro', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $db = SQL::connect();
    $model = new MovilOdometro();

    $results = $model->put($db);

    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});
?>