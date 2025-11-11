package com.pifsite.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pifsite.application.entities.Post;
import com.pifsite.application.dto.PostDTO;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    @Query("SELECT new com.pifsite.application.dto.PostDTO(p.id, p.title, p.body, p.createdAt, p.owner.username) FROM Post p JOIN p.owner")
    List<PostDTO> getAllPosts();

}
