<?php

class MovilBitacora
{
    public $table = 'MovilBitacora';
    public $fields = 'mobiId
            ,mobiMoviId
            ,mobiMoseId
            ,mobiServId
            ,CONVERT(VARCHAR, mobiFecha, 126) mobiFecha
            ,mobiObservaciones
            ,mobiOdometro
            ,mobiProximoOdometro
            ,CONVERT(VARCHAR, mobiProximaFecha, 126) mobiProximaFecha
            ,mobiIdAnterior
            ,mobiIdSiguiente
            ,mobiPendiente
            ,CONVERT(VARCHAR, mobiFechaAlta, 126) mobiFechaAlta
            ,mobiBorrado
            ,servNombre'; 

    public $join = " LEFT OUTER JOIN Servicio  ON mobiServId  = servId
                    LEFT OUTER JOIN Movil  ON mobiMoviId  = moviId
                    LEFT OUTER JOIN MovilServicio  ON mobiMoseId  = mobiId";
    
    public function get ($db) {
        $sql = "SELECT TOP (1000) $this->fields FROM $this->table
                $this->join
                WHERE mobiBorrado = 0";

        $params = null;
        if (isset( $_GET["mobiMoviId"])){
            $params = [$_GET["mobiMoviId"]];
            $sql = $sql . " AND mobiMoviId = ? ";
        };
        if (isset( $_GET["mobiServId"])){
            $params = [$_GET["mobiServId"]];
            $sql = $sql . " AND mobiServId = ? ";
        };
        if (isset( $_GET["mobiMobiId"])){
            $params = [$_GET["mobiMobiId"]];
            $sql = $sql . " AND mobiMobiId = ? ";
        };
        

        $stmt = SQL::query($db, $sql, $params);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET mobiBorrado = 1 - mobiBorrado
        WHERE mobiId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $sql = "INSERT INTO $this->table
            (mobiMoviId
            ,mobiMoseId
            ,mobiServId
            ,mobiFecha
            ,mobiObservaciones
            ,mobiOdometro
            ,mobiProximoOdometro
            ,mobiProximaFecha
            ,mobiIdAnterior
            ,mobiIdSiguiente
            ,mobiPendiente
            ,mobiFechaAlta
            ,mobiBorrado)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,GETDATE(),0);
        SELECT @@IDENTITY mobiId, CONVERT(VARCHAR, GETDATE(),126 ) mobiFechaAlta;";        
        $params = [ DATA["mobiMoviId"]
        ,DATA["mobiMoseId"]
        ,DATA["mobiServId"]
        ,DATA["mobiFecha"]
        ,DATA["mobiObservaciones"]
        ,DATA["mobiOdometro"]
        ,DATA["mobiProximoOdometro"]
        ,DATA["mobiProximaFecha"]
        ,DATA["mobiIdAnterior"]
        ,DATA["mobiIdSiguiente"]
        ,DATA["mobiPendiente"]];

        $stmt = SQL ::query($db,$sql, $params);
        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["mobiId"] = $row["mobiId"];
        $results["mobiFechaAlta"] = $row["mobiFechaAlta"];
        $results["mobiBorrado"] = 0;
        return DATA;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET mobiServId  = ?
        WHERE mobiId  = ?",
        [
            DATA["mobiMoviId"],
            DATA["mobiId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>