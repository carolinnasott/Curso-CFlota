<?php

class MovilServicio
{
    public $table = 'MovilServicio';
    public $fields = 'moseId
            ,moseMoviId
            ,moseServId
            ,mosePeriodo
            ,moseKM
            ,moseFecha
            ,CONVERT(VARCHAR, moseFechaAlta, 126) moseFechaAlta
            ,moseBorrado
            ,servNombre'; 

    public $join = " LEFT OUTER JOIN Servicio  ON moseServId  = servId";
    
    public function get ($db) {
        $sql = "SELECT TOP (1000) $this->fields FROM $this->table
                $this->join
                WHERE moseBorrado = 0";

        $params = null;
        if (isset( $_GET["moseMoviId"])){
            $params = [$_GET["moseMoviId"]];
            $sql = $sql . " AND moseMoviId = ? ";
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