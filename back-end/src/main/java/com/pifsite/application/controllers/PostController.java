package com.pifsite.application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.pifsite.application.service.PostService;
import com.pifsite.application.dto.CreatePostDTO;
import com.pifsite.application.dto.PostDTO;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts(){

        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);

    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody CreatePostDTO postDTO){

        postService.createPost(postDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post criado");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        
        postService.deleteOnePost(id);
        return ResponseEntity.ok("Post successfully deleted.");
    }
}
