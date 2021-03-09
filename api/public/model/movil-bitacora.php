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
                    LEFT OUTER JOIN MovilServicio  ON mobiMoseId  = moseId";
    
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
        if (isset( $_GET["mobiMoseId"])){
            $params = [$_GET["mobiMoseId"]];
            $sql = $sql . " AND mobiMoseId = ? ";
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
        "UPDATE $this->table SET moseBorrado = 1 - moseBorrado
        WHERE moseId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $sql = "INSERT INTO $this->table
            (moseMoviId
            ,moseServId
            ,mosePeriodo
            ,moseKM
            ,moseFecha
            ,moseFechaAlta
            ,moseBorrado)
        VALUES (?,?,?,?,?,GETDATE(),0);
        SELECT @@IDENTITY moseId, CONVERT(VARCHAR, GETDATE(),126 ) moseFechaAlta;";        
        $params = [ DATA["moseMoviId"]
        ,DATA["moseServId"]
        ,DATA["mosePeriodo"]
        ,DATA["moseKM"]
        ,DATA["moseFecha"]];

        $stmt = SQL ::query($db,$sql, $params);
        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["moseId"] = $row["moseId"];
        $results["moseFechaAlta"] = $row["moseFechaAlta"];
        $results["moseBorrado"] = 0;
        return DATA;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET moseServId  = ?
        WHERE moseId  = ?",
        [
            DATA["moseMoviId"],
            DATA["moseId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>