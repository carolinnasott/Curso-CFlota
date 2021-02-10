<?php
include_once "model/grupo-servicio.php";

$app->get('/grupo-servicio', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_VER");

    $db = SQL::connect();
    $model = new GrupoServicio();

    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });

$app->delete('/grupo-servicio/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQL::connect();
    $model = new GrupoServicio();

    $results = $model->delete($db, $id);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });

$app->post('/grupo-servicio', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $db = SQL::connect();
    $model = new GrupoServicio();

    $results = $model->post($db);

    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});

$app->put('/grupo-servicio', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $db = SQL::connect();
    $model = new GrupoServicio();

    $results = $model->put($db);

    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});
?>