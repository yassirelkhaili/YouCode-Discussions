<?php

namespace SimpleKit\Controllers;

use function SimpleKit\Helpers\redirect;
use SimpleKit\Models\Thread;
use SimpleKit\Models\Threadtags;
use SimpleKit\Models\Tag;
use SimpleKit\Helpers\Request;

class ThreadController extends BaseController {
    
    protected $thread;  // This translates to thread
    protected $tag;

    protected $threadtag;

    public function __construct() {
        // Instantiate the thread and assign it to the protected property
        $this->thread = new Thread();
        $this->tag = new Tag();
        $this->threadtag = new Threadtags();
    }

    public static function hasPermissionTo (int $id, Thread $thread) {
        return $thread->getById($id)[0]['authorID'] === $_SESSION['user_id'] || $_SESSION['user_role'] === 'admin';
    }

    public function indexUserthreads() {
        if (!isset($_SESSION['user_id'])) {
            redirect('/login');
            exit();
        }
        // Fetch all users using the thread
        try {
            $threads = $this->thread->raw("SELECT w.id, w.title, w.content, c.name AS category, u.username AS author, GROUP_CONCAT(t.name) AS tags FROM thread w JOIN user u ON w.authorID = u.id JOIN category c ON w.categoryID = c.id LEFT JOIN thread_tags wt ON w.id = wt.threadID LEFT JOIN tag t ON wt.tagID = t.id WHERE w.authorID = :id GROUP BY w.id, w.title, w.content, c.name, u.username ORDER BY w.created_at DESC;", ['id' => $_SESSION['user_id']]);
            // Render the view and pass the thread data to it
        echo json_encode(["status" => "success", "message" => "threads fetched successfuly", "content" => $threads]);
        } catch (\Exception $e) {
            echo json_encode(["status" => "insert", "message" => "There was a problem fetching the threads"]);
        }
    }

    public function index() {
        // Fetch all users using the thread
        try {
            $threads = $this->thread->raw("SELECT w.id, w.title, w.content, c.name AS category, u.username AS author, GROUP_CONCAT(t.name) AS tags FROM thread w JOIN user u ON w.authorID = u.id JOIN category c ON w.categoryID = c.id LEFT JOIN thread_tags wt ON w.id = wt.threadID LEFT JOIN tag t ON wt.tagID = t.id GROUP BY w.id, w.title, w.content, c.name, u.username ORDER BY w.created_at DESC;");
            // Render the view and pass the thread data to it
        echo json_encode(["status" => "success", "message" => "threads fetched successfuly", "content" => $threads]);
        } catch (\Exception $e) {
            echo json_encode(["status" => "insert", "message" => "There was a problem fetching the threads"]);
        }
    }

    public function create(Request $request) {
        // Render the view for creating a new wik
        if (!isset($_SESSION['user_id'])) {
            redirect('/login');
            exit();
        } 
        $data = ['title' => $request->getPostData('title'), 'content' => $request->getPostData('content'), 'categoryID' => $request->getPostData('categoryID'), 'authorID' => $_SESSION['user_id']];
        try {
            $lastInsertedthreadID = $this->thread->create($data)[0];
            //insert tags
            $lastInsertedTagIDs = [];
            $tags = $request->getPostData("tags");
            foreach ($tags as $value) $lastInsertedTagIDs[] = $this->tag->create(['name' => $value]);

            //assign tags to thread in thread_tags pivot table
            foreach ($tags as $index => $value) $this->threadtag->create(['threadID' => $lastInsertedthreadID, 'tagID' => $lastInsertedTagIDs[$index][0]]);
        } catch (\Exception $e) {
            echo json_encode(["status" => "insert", "message" => "There was an error publishing the thread"]);
        }
        echo json_encode(["status" => "success", "message" => "thread Created successfully"]);
    }

    public function store(Request $request) {
        $data = $request->getPostData();
        // Create a new wik using the thread
        $this->thread->create($data);

        // Redirect back to the index page with a success message (or handle differently based on your needs)
        // You can also render a view or return a JSON response
        return redirect('/books')->with(['success' => 'book created successfully!']);  // Note the change here
    }

    public function show(int $id) {
        // Fetch a specific wik by ID using the thread
        $wik = $this->thread->getById($id);

        // Render the view and pass the wik data to it
        $this->render('wik/show', ['wik]' => $wik]);
        /*
        with javascript:
        http_response_code(200);
        echo json_encode($book);
        */
    }

    public function edit(Request $request, $id) {
      if (ThreadController::hasPermissionTo($id, $this->thread)) {
        try {
            // Fetch a specific wik by ID using the thread
            $this->thread->updateById($id, ['title' => $request->getPostData("title"), 'content' => $request->getPostData("content"),'categoryID' => $request->getPostData("categoryID")]);
            //delete old tags
            $tagIdsToDelete = $this->threadtag->raw("SELECT tagID FROM thread_tags WHERE threadID = :threadId", ['threadId' => $id]);
            foreach ($tagIdsToDelete as $tagID) $this->tag->deleteById($tagID['tagID']);
            // add new tags
            $lastInsertedTagIDs = [];
                $tags = $request->getPostData("tags");
                foreach ($tags as $value) $lastInsertedTagIDs[] = $this->tag->create(['name' => $value]);
                //assign tags to thread in thread_tags pivot table
                foreach ($tags as $index => $value) $this->threadtag->create(['threadID' => $id, 'tagID' => $lastInsertedTagIDs[$index][0]]);
                echo json_encode(["status" => "success", "message" => "thread edited successfully"]);
          } catch (\Exception $e) {
           echo json_encode(["status" => "insert", "message" => "There was an error editing the thread"]);
          }
      } else {
        echo json_encode(["status" => "permission", "message" => "User doesnt have permission to perform this action"]);
      }
    }


    public function destroy($id) {
        if (ThreadController::hasPermissionTo($id, $this->thread)) {
            try {
                // Delete a specific wik by ID using the thread
            $tagIdsToDelete = $this->threadtag->raw("SELECT tagID FROM thread_tags WHERE threadID = :threadId", ['threadId' => $id]);
            foreach ($tagIdsToDelete as $tagID) $this->tag->deleteById($tagID['tagID']);
            $this->thread->deleteById($id);
            // Redirect back to the index page with a success message (or handle differently based on your needs)
            echo json_encode(["status" => "success", "message" => "thread Deleted successfully"]);
            } catch (\Exception $e) {
            echo json_encode(["status" => "success", "message" => "There was an error deleting the thread"]);
            }
        } else {
            echo json_encode(["status" => "permission", "message" => "User doesnt have permission to perform this action"]);
        }
    }

    // You can add more controller methods as needed to handle other wik-related functionalities
}