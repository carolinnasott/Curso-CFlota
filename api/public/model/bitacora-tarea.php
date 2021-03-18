<?php

class BitacoraTarea
{
    public $table = 'BitacoraTarea';
    public $fields = 'bitaId
            ,bitaMobiId
            ,bitaTareId
            ,bitaObservaciones
            ,bitaCantidad
            ,bitaCosto
            ,CONVERT(VARCHAR, bitaFechaAlta, 126) bitaFechaAlta
            ,bitaBorrado
            ,tareNombre'; 

    public $join = " LEFT OUTER JOIN Tarea  ON bitaTareId  = tareId";
    
    public function get ($db) {
        $sql = "SELECT TOP (1000) $this->fields FROM $this->table
                $this->join
                WHERE bitaBorrado = 0";

        $params = null;

        if (isset( $_GET["bitaTareId"])){
            $params = [$_GET["bitaTareId"]];
            $sql = $sql . " AND bitaTareId = ? ";
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
        "UPDATE $this->table SET bitaBorrado = 1 - bitaBorrado
        WHERE bitaId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $sql = "INSERT INTO $this->table
            (bitaMobiId
            ,bitaTareId
            ,bitaObservaciones
            ,bitaCantidad
            ,bitaCosto
            ,bitaCostoAlta
            ,bitaBorrado)
        VALUES (?,?,?,?,?,GETDATE(),0);
        SELECT @@IDENTITY bitaId, CONVERT(VARCHAR, GETDATE(),126 ) bitaCostoAlta;";        
        $params = [ DATA["bitaMobiId"]
        ,DATA["bitaTareId"]
        ,DATA["bitaObservaciones"]
        ,DATA["bitaCantidad"]
        ,DATA["bitaCosto"]];

        $stmt = SQL ::query($db,$sql, $params);
        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["bitaId"] = $row["bitaId"];
        $results["bitaCostoAlta"] = $row["bitaCostoAlta"];
        $results["bitaBorrado"] = 0;
        return DATA;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET bitaTareId  = ?
        WHERE bitaId  = ?",
        [
            DATA["bitaMobiId"],
            DATA["bitaId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>