<?php

namespace SimpleKit\SimpleORM;

use PDO, Exception;
use SimpleKit\SimpleORM\QueryGenerator;
use SimpleKit\Database\Connections\DatabaseConnection;

class EntityManager
{
    private PDO $db;
    private string $entity_name;
    private array $columns = array();
    private QueryGenerator $query_generator;

    public function __construct(string $entity_name)
    {
        $this->entity_name = $entity_name;
        $conn = new DatabaseConnection();
        $this->db = $conn->getConnection();
    }

    //setter and getter for dynamic column calling

    public function __set(string $name, $value): void
    {
        $this->columns[$name] = $value;
    }

    public function __get(string $name)
    {
        return $this->columns[$name] ?? null;
    }

    //manage update method argument count

    public function __call (string $name, array $arguments) {
       if ($name === "update") {
        $argument_count = count($arguments);
        switch ($argument_count) {
            case 1:
                return $this->updateMultiple($arguments[0]);
            case 2;
                return $this->updateOne($arguments[0], $arguments[1]);
            default:
            exit("invalid number of parameters");
        }
       }
    }

    //migrate entitity
    public function up(array $data): void
    {
        try {
            $query = QueryGenerator::generateTableQuery($data);
            $stmt = $this->db->prepare($query);
            if (!$stmt) {
                throw new Exception("Error preparing statement");
            }
            if (!$stmt->execute()) {
                throw new Exception("Error creating the table");
            }
            exit("Table: $data[entityName] has been migrated");
        } catch (Exception $exception) {
            echo "An Error has occured: " . $exception->getMessage();
        }
    }

    //rollback entity
    public function down(): void
    {
        try {
            $query = "DROP TABLE $this->entity_name";
            $stmt = $this->db->prepare($query);
            if (!$stmt) {
                throw new Exception("Error preparing statement");
            }
            if (!$stmt->execute()) {
                throw new Exception("Error creating the table");
            }
            exit("Table: $this->entity_name was dropped sussesfully");
        } catch (Exception $exception) {
            echo "An Error has occured: " . $exception->getMessage();
        }
    }

    //create methods

    public function raw(string $query, array $params = []): array
    {
        try {
            $stmt = $this->db->prepare($query);
            
            // Bind parameters if provided
            foreach ($params as $key => &$value) {
                $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                $stmt->bindParam(":" . $key, $value, $paramType);
            }
            
            if (!$stmt) {
                throw new Exception("Error preparing statement");
            }
            
            if (!$stmt->execute()) {
                throw new Exception("Error executing raw query");
            }
            
            // Fetch results as an associative array
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Flush resources
            $stmt = null;
    
            return $results;
            
        } catch (Exception $exception) {
            echo "An Error has occurred: " . $exception->getMessage();
            return [];  // Return an empty array in case of error
        }
    }    
 
    public function save(): self
    {
        try {
            $query = QueryGenerator::insertRecord($this->columns, $this->entity_name);
            $stmt = $this->db->prepare($query);
            foreach ($this->columns as $key => $value) {
                $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                $stmt->bindValue(":" . $key, $value, $paramType);
            }
            if (!$stmt) {
                throw new Exception("Error preparing statement");
            }
            if (!$stmt->execute()) {
                throw new Exception("Error creating record");
            }
            exit("Record has been saved");
        } catch (Exception $exception) {
            echo "An Error has occured: " . $exception->getMessage();
        }
        $this->flush();
        return $this;
    }
    public function saveMany(array $columns): array
    {
        $lastInsertedIds = [];  // Store last inserted IDs
    
        foreach ($columns as $item) {
            try {
                $query = QueryGenerator::insertRecord($item, $this->entity_name);
                $stmt = $this->db->prepare($query);
    
                foreach ($item as $key => $itemValue) {
                    $paramType = is_int($itemValue) ? PDO::PARAM_INT : PDO::PARAM_STR;
                    $stmt->bindValue(":" . $key, $itemValue, $paramType);
                }
    
                if (!$stmt) {
                    throw new Exception("Error preparing statement");
                }
    
                if (!$stmt->execute()) {
                    throw new Exception("Error creating records");
                }
    
                // Get the last inserted ID for each item
                $lastInsertedIds[] = $this->db->lastInsertId();
    
            } catch (Exception $exception) {
                echo "An Error has occurred: " . $exception->getMessage();
            }
        }
    
        // Return the last inserted IDs array
        return $lastInsertedIds;
    }
    

    //fetch methods
    public function fetchAll(): self
    {
        $this->query_generator = new QueryGenerator($this->entity_name);
        $this->query_generator->generateFetchAllQuery();
        return $this;
    }

    public function where(string $column, $value): self
    {
        $this->query_generator->stashWhereCondition($column, $value);
        return $this;
    }

    public function get($limit_count = 0)
    {
        $query = $this->query_generator->generateFinalQuery($limit_count);
        $conditions = $this->query_generator->exportWhereConditions();
        try {
            $stmt = $this->db->prepare($query);
            if (!empty($conditions)) {
                foreach ($conditions as $key => $value) {
                    $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                    $stmt->bindValue(":" . $key, $value, $paramType);
                }
            }
            if (!$stmt) {
                throw new Exception("Error preparing statement");
            }
            if (!$stmt->execute()) {
                throw new Exception("Error creating record");
            } 
            $this->query_generator->flushChainedQuery();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (Exception $exception) {
            echo "An Error has occurred: " . $exception->getMessage();
        }        
    }

    //update methods
    //one
    private function updateOne(string $column, $value) {
        $this->query_generator = new QueryGenerator($this->entity_name);
        $this->query_generator->generateUpdateQuery($column, $value);
        return $this;
    }
    //multiple
    private function updateMultiple(array $data) {
        $this->query_generator = new QueryGenerator($this->entity_name);
        $this->query_generator->generateUpdateQueryMultiple($data);
        return $this;
    }

    //delete methods
    public function delete(): self {
        $this->query_generator = new QueryGenerator($this->entity_name);
        $this->query_generator->generateDeleteQuery();
        return $this;
    }

    public function confirm () {
        $query = $this->query_generator->generateFinalQuery();
        $whereConditions = $this->query_generator->exportWhereConditions();
        $updateConditions = $this->query_generator->exportUpdateConditions();
        $queryType = substr($query, 0, 6);
        try {
            $stmt = $this->db->prepare($query);
            if (!empty($updateConditions)) {
                foreach ($updateConditions as $key => $value) {
                    $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                    $stmt->bindValue(":" . $key, $value, $paramType);
                }
            }
            if (!empty($whereConditions)) {
                foreach ($whereConditions as $key => $value) {
                    $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                    $stmt->bindValue(":" . $key, $value, $paramType);
                }
            }
            if (!$stmt) {
                throw new Exception("Error preparing statement");
            }
            if (!$stmt->execute()) {
                throw new Exception("Error creating record");
            } 
            // echo "Records " . ($queryType === "UPDATE" ? 'updated' : 'deleted') . " successfully\n"; echo delete action status
            $this->query_generator->flushChainedQuery();
        } catch (Exception $exception) {
            echo "An Error has occurred: " . $exception->getMessage();
        }        
    }

    //count all records

    public function count() {
        $this->query_generator = new QueryGenerator($this->entity_name);
        $query = $this->query_generator->generateCountQuery();
        return $this;
    }

    public function orderBy(array $fields, $direction = "ASC"): self {
        $this->query_generator->setOrderByConditions($fields, $direction);
        return $this;
    }

    //empty instance inner data method
    public function flush(): EntityManager
    {
        $this->columns = [];
        return $this;
    }
    //for debugging perposes
    //list all instance inner data
    public function list(): void
    {
        foreach ($this->columns as $column) {
            echo $column;
        }
    }
}
