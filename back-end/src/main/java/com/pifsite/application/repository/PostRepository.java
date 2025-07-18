package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Post;
import com.pifsite.application.dto.PostDTO;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    @Query(nativeQuery = true, value = "SELECT post_id, tittle, body, created_at, owner from posts")
    List<PostDTO> getAllPosts();
}
