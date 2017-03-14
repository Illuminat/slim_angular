<?php
namespace Model;


class Task {

    protected $db;
    protected $table = 'task';

    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    public function getTasks()
    {

    }

    public function getTask()
    {

    }

    public function updateTask()
    {

    }

    public function createTask()
    {

    }

    public function deleteTask()
    {

    }


}