package com.pifsite.application.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.pifsite.application.service.PostService;
import com.pifsite.application.dto.CreatePostDTO;
import com.pifsite.application.dto.PostDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/post")
@Tag(name = "PostController", description = "Endpoints to get, create, delete and update professors")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    @Operation(summary = "Get Post", description = "Get all Posts from database")
    public ResponseEntity<?> getAllPosts() {

        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    @Operation(summary = "Create Post", description = "Create a Post and save on the database")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString(), T(com.pifsite.application.security.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<?> createPost(@RequestBody CreatePostDTO postDTO) {

        postService.createPost(postDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post created");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Post", description = "Update a Post on database by its ID")
    public ResponseEntity<?> updatePost(@RequestBody CreatePostDTO postDTO, @PathVariable UUID id) {

        postService.updatePost(postDTO, id);
        return ResponseEntity.status(HttpStatus.OK).body("Post Atualizado");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Post", description = "Delete a Post on database by its ID")
    @PreAuthorize("hasAnyRole(T(com.pifsite.application.security.UserRoles).ADMIN.toString(), T(com.pifsite.application.security.UserRoles).PROFESSOR.toString())")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {

        postService.deleteOnePost(id);
        return ResponseEntity.ok("Post successfully deleted.");
    }
}
